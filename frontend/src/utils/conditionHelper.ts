import type { Answer } from "@/stores/interfaces";
import { BinaryOperator, ConditionOperator, QuestionKind } from "@/stores/interfaces";
import type { QuestionCondition as IQuestionConditionFromApi } from "@/stores/interfaces";
import type { SurveyQuestion } from "@/stores/customerSubmitSurvey";
import { useCustomerSubmissionStore } from "@/stores/customerSubmitSurvey";
import _ from "lodash";
import { format } from "date-fns";

export interface IConditionFromApi {
    id: number;
    children: IConditionFromApi[];
    name: string;
    description: string;
    operator: BinaryOperator | null;
    parent: number | null;
    question_condition: IQuestionConditionFromApi | null;
}

export interface ICondition {
    id: number;

    evaluate(): boolean;

    getEvaluationLog(): string[];

    stringify(): string;

    operator: BinaryOperator | null;
    questionCondition: IQuestionCondition | null;

    readonly children: ICondition[];
}

export interface IQuestionCondition {
    id: number;
    operator: ConditionOperator;
    text_value: string | null;
    question: number | null;

    /***
     * The PK of a 'Value'
     */
    value: number | null;
}

export class Condition implements ICondition {
    public readonly id;
    public readonly children;
    public operator;
    public parent: Condition | null = null;
    public questionCondition: QuestionCondition | null = null;

    private readonly evaluationLog: string[] = [];

    protected constructor(conditionId: number, children: ICondition[], operator: BinaryOperator | null) {
        this.id = conditionId;
        this.children = children;
        this.operator = operator;
    }

    public evaluate(): boolean {
        if (this.questionCondition) {
            return this.questionCondition.evaluate();
        } else {
            const childResults = this.children.map(c => c.evaluate());
            if (this.operator === BinaryOperator.OR) {
                return childResults.some(r => r);
            } else {
                return !childResults.some(r => !r);
            }
        }
    }

    public stringify(): string {
        if (this.questionCondition) {
            return this.questionCondition.stringify();
        } else {
            const operator = this.operator === BinaryOperator.OR ? "\n oder \n" : "\n und \n";
            return this.children.map(c => c.stringify()).join(operator);
        }
    }

    public log(msg: string) {
        if (this.parent) {
            this.parent.log(msg);
        } else {
            const timestamp = format(new Date(), "dd.MM.yyyy HH:mm:ss.SSS");
            this.evaluationLog.push(`[${timestamp}] [Condition ${this.id}] ${msg}`);
        }
    }

    public getEvaluationLog() {
        return this.evaluationLog;
    }

    public static create(data: IConditionFromApi): Condition {
        if (!data) throw "data is required";

        console.log("creating condition: ", data);

        let childConditions: Condition[] = [];
        if (data.children.length > 0) {
            childConditions = data.children.map(c => this.create(c));
        }

        const condition = new Condition(data.id, childConditions, data.operator);
        childConditions.forEach(c => (c.parent = condition));

        if (data.question_condition) {
            condition.questionCondition = new QuestionCondition(
                condition,
                data.id,
                data.question_condition.question,
                data.question_condition.operator as ConditionOperator,
                data.question_condition.text_value,
                data.question_condition.question,
                data.question_condition.value
            );
        }

        console.log("condition created: ", condition);
        return condition;
    }
}

export class QuestionCondition implements IQuestionCondition {
    id: number;
    operator: ConditionOperator;
    text_value: string | null;
    condition: Condition;
    question: number | null;
    /***
     * The PK of a 'Value'
     */
    value: number | null;
    readonly conditionedQuestionId: number;

    constructor(
        condition: Condition,
        id: number,
        conditionQuestionId: number,
        operator: ConditionOperator,
        text_value: string | null,
        question: number | null,
        value: number | null
    ) {
        this.condition = condition;
        this.id = id;
        this.conditionedQuestionId = conditionQuestionId;
        this.operator = operator;
        this.text_value = text_value;
        this.question = question;
        this.value = value;
    }

    public stringify(): string {
        const store = useCustomerSubmissionStore();
        const question = store.surveyQuestions.find(sq => sq.id === this.question);
        const valueRange = store.valueRanges.find(vr => vr.id === question?.question?.value_range);
        const valueRangeValues = valueRange?.values || [];
        const isTextQuestion =
            valueRange?.kind === QuestionKind.TEXT_MULTILINE || valueRange?.kind === QuestionKind.TEXT_SINGLELINE;
        const compareValueResolvedName = valueRangeValues.find(v => v.id === this.value)?.name || this.text_value || "";
        let operatorMeaning: string;
        switch (this.operator) {
            case ConditionOperator.EQUALS:
                operatorMeaning = `'${compareValueResolvedName}'`;
                break;
            case ConditionOperator.GREATER_OR_EQUAL:
                operatorMeaning = `einem Wert grösser oder gleich '${compareValueResolvedName}'`;
                break;
            case ConditionOperator.GREATER_THAN:
                operatorMeaning = `einem Wert grösser '${compareValueResolvedName}'`;
                break;
            case ConditionOperator.INCLUDES:
                operatorMeaning = isTextQuestion
                    ? `einem Wert der '${compareValueResolvedName}' enthält`
                    : `'${compareValueResolvedName}'`;
                break;
            case ConditionOperator.LESS_OR_EQUAL:
                operatorMeaning = `einem Wert kleiner oder gleich '${compareValueResolvedName}'`;
                break;
            case ConditionOperator.LESS_THAN:
                operatorMeaning = `einem Wert kleiner '${compareValueResolvedName}'`;
                break;
            default:
                console.error("Unbekannter operator: ", this.operator);
                operatorMeaning = "";
        }
        return `'${question?.question.name}' beantwortet mit ${operatorMeaning}\n`;
    }

    private compareText(answer: Answer): boolean {
        let equal = false;
        if (answer.text && this.text_value) {
            let answerText: string | number = answer.text.toLocaleLowerCase().trim();
            let compareText: string | number = this.text_value.toLocaleLowerCase().trim();
            if (!isNaN(parseInt(answerText)) && !isNaN(parseInt(compareText))) {
                answerText = parseInt(answerText);
                compareText = parseInt(compareText);
            }
            switch (this.operator) {
                case ConditionOperator.EQUALS:
                    equal = answerText === compareText;
                    break;
                case ConditionOperator.GREATER_OR_EQUAL:
                    equal = answerText >= compareText;
                    break;
                case ConditionOperator.GREATER_THAN:
                    equal = answerText > compareText;
                    break;
                case ConditionOperator.INCLUDES:
                    equal = answerText.toString().includes(compareText.toString());
                    break;
                case ConditionOperator.LESS_OR_EQUAL:
                    equal = answerText <= compareText;
                    break;
                case ConditionOperator.LESS_THAN:
                    equal = answerText < compareText;
                    break;
            }
        }
        return equal;
    }

    private compareValue(answer: Answer): boolean {
        let satisfied = false;
        if (!!answer.values && this.value) {
            const store = useCustomerSubmissionStore();
            const question = store.surveyQuestions.find(sq => sq.id === this.question);
            const valueRange = store.valueRanges.find(vr => vr.id === question?.question?.value_range);
            const valueRangeValues = valueRange?.values || [];
            const answerValuesResolved: number[] = answer.values
                .map(av => valueRangeValues.find(v => v.id === av)?.value)
                .filter(v => v) as number[];
            const answerValuesResolvedNames: string[] = answer.values
                .map(av => valueRangeValues.find(v => v.id === av)?.name)
                .filter(v => v) as string[];
            const compareValueResolved = valueRangeValues.find(v => v.id === this.value)?.value;
            const compareValueResolvedName = valueRangeValues.find(v => v.id === this.value)?.name;
            this.condition.log(`Antwort(en): ${answerValuesResolvedNames}`);

            const operaterHumanized = {
                [ConditionOperator.EQUALS]: "=",
                [ConditionOperator.GREATER_THAN]: ">",
                [ConditionOperator.GREATER_OR_EQUAL]: ">=",
                [ConditionOperator.LESS_THAN]: "<",
                [ConditionOperator.LESS_OR_EQUAL]: "<=",
                [ConditionOperator.INCLUDES]: "enthält",
            };

            this.condition.log(
                `Bedingung: <Antwort> ${operaterHumanized[this.operator]} '${compareValueResolvedName}'`
            );

            if (!_.isNil(compareValueResolved)) {
                switch (this.operator) {
                    case ConditionOperator.EQUALS:
                        satisfied = _.isEqual(_.sortBy(answer.values), _.sortBy([this.value]));
                        break;
                    case ConditionOperator.GREATER_OR_EQUAL:
                        satisfied = answerValuesResolved.some(v => v >= compareValueResolved);
                        break;
                    case ConditionOperator.GREATER_THAN:
                        satisfied = answerValuesResolved.some(v => v > compareValueResolved);
                        break;
                    case ConditionOperator.INCLUDES:
                        satisfied = answer.values.includes(this.value);
                        break;
                    case ConditionOperator.LESS_OR_EQUAL:
                        satisfied = answerValuesResolved.some(v => v <= compareValueResolved);
                        break;
                    case ConditionOperator.LESS_THAN:
                        satisfied = answerValuesResolved.some(v => v < compareValueResolved);
                        break;
                }
            }
        }
        this.condition.log(`Bedingung erfüllt: ${satisfied ? "Ja" : "Nein"}`);
        return satisfied;
    }

    public evaluate(): boolean {
        // if (!this.parent) {
        //     this.clearLog();
        // }

        const store = useCustomerSubmissionStore();
        const question = store.surveyQuestions.find(sq => sq.id === this.question) as SurveyQuestion;
        const conditionedQuestion: SurveyQuestion | undefined = store.surveyQuestions.find(
            sq => sq.id === this.conditionedQuestionId
        );

        let questionNameLog = `id=${this.conditionedQuestionId}`;
        if (conditionedQuestion) {
            const name = conditionedQuestion.question.name;
            questionNameLog = `${name} (${questionNameLog})`;
        }
        this.condition.log(
            `Evaluiere 'Fragebedingung' (id=${this.id}) für Frage '${questionNameLog}'. Zielfrage '${question.question.name}' (id=${question.question.id}): '${question.question.text}'`
        );

        let conditionSaitisfied = false;
        if (question.condition) {
            if (question.id === this.conditionedQuestionId) throw "Condition cycle found";
            this.condition.log(`Zielfrage '${question.question.name}' hat eine Bedingung. Evaluiere...`);
        }
        const relatedConditionSatisfied = !question.condition || question.condition.evaluate();
        if (relatedConditionSatisfied) {
            const answer = (store.answers || []).find(a => a.question === this.question);
            this.condition.log(`Antwort zur Zielfrage gefunden: ${answer ? "Ja" : "Nein"}`);

            if (answer) {
                if (this.text_value) {
                    conditionSaitisfied = this.compareText(answer);
                } else {
                    conditionSaitisfied = this.compareValue(answer);
                }
            } else {
                this.condition.log("Da keine Antwort zur Frage gefunden wurde, ist das Resultat negativ");
            }
        } else {
            this.condition.log("Zielfrage hat eine Bedingung, die nicht erfüllt wurde.");
        }

        return conditionSaitisfied;
    }
}
