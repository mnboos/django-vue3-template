import { describe, it, expect, vi } from "vitest";
import { useCustomerSubmissionStore } from "../../stores/customer";
import { createPinia, setActivePinia } from "pinia";

describe("utils", () => {
    // beforeEach(() => {
    //     vi.restoreAllMocks();
    //     vi.clearAllMocks();
    // });
    // afterEach(() => {
    //     vi.restoreAllMocks();
    //     vi.clearAllMocks();
    // });

    it("render question only if singleselect condition is satisfied", async () => {
        setActivePinia(createPinia());

        vi.mock("../networkHelper.ts", () => {
            return {
                __esModule: true,
                default: vi.fn().mockImplementation(() => {
                    return {
                        getSafe: vi
                            .fn()
                            .mockResolvedValueOnce({
                                title: "UT-Umfrage",
                                token: "foobar",
                                readonly: false,
                                questions: [
                                    {
                                        id: 2,
                                        sort_id: 1,
                                        mandatory: false,
                                        question: {
                                            id: 2,
                                            name: "Service-Zufriedenheit",
                                            text: "Wie zufrieden sind Sie mit dem Service?",
                                            kind: "SS",
                                            value_range: 2,
                                        },
                                        condition: null,
                                    },
                                    {
                                        id: 3,
                                        sort_id: 2,
                                        mandatory: false,
                                        question: {
                                            id: 3,
                                            name: "Empfehlung",
                                            text: "Würden Sie unseren Service weiterempfehlen?",
                                            kind: "SS",
                                            value_range: 3,
                                        },
                                        condition: null,
                                    },
                                    {
                                        id: 4,
                                        sort_id: 4,
                                        mandatory: false,
                                        question: {
                                            id: 4,
                                            name: "Testfrage",
                                            text: "Geht es Ihnen gut?",
                                            kind: "SS",
                                            value_range: 3,
                                        },
                                        condition: null,
                                    },
                                    {
                                        id: 5,
                                        sort_id: 3,
                                        mandatory: false,
                                        question: {
                                            id: 5,
                                            name: "Warum nicht?",
                                            text: "Warum nicht?",
                                            kind: "ML",
                                            value_range: null,
                                        },
                                        condition: {
                                            id: 4,
                                            condition_type: "QUESTION",
                                            operator: "==",
                                            text_value: null,
                                            question: 3,
                                            value: 7,
                                        },
                                    },
                                ],
                                valueRanges: [
                                    {
                                        id: 2,
                                        values: [
                                            { id: 2, sort_id: 0, name: "Unzufrieden", value: 0 },
                                            { id: 3, sort_id: 1, name: "Eher unzufrieden", value: 1 },
                                            { id: 4, sort_id: 2, name: "Eher zufrieden", value: 2 },
                                            { id: 5, sort_id: 3, name: "Zufrieden", value: 3 },
                                        ],
                                        name: "Zufriedenheitsskala",
                                        kind: "SS",
                                    },
                                    {
                                        id: 3,
                                        values: [
                                            { id: 6, sort_id: 0, name: "Ja", value: 1 },
                                            { id: 7, sort_id: 1, name: "Nein", value: 0 },
                                        ],
                                        name: "Ja/nein",
                                        kind: "SS",
                                    },
                                ],
                            })
                            .mockResolvedValueOnce([
                                {
                                    id: 9,
                                    text: null,
                                    question: 3,
                                    submission: 2,
                                    values: [7],
                                },
                            ]),
                    };
                }),
            };
        });
        const store = useCustomerSubmissionStore();
        expect(store.surveyQuestions.length).toBe(0);

        await store.fetchSubmission("sampletoken");
        expect(store.token.length).toBeGreaterThan(0);

        await store.fetchAnswers("sampletoken");
        expect(store.answers.length).toBeTruthy();

        expect(store.surveyQuestions.length).toBeTruthy();

        const conditionedQuestion = store.surveyQuestions[2];
        expect(conditionedQuestion.question.text).toBe("Warum nicht?");
        expect(conditionedQuestion.condition).toBeDefined();

        const conditionSatisfied = conditionedQuestion.condition?.evaluate();
        // console.log(conditionedQuestion.condition?.getEvaluationLog());
        expect(conditionSatisfied).toBeTruthy();
    });
});
