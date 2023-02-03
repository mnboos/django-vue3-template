/// <reference types='codeceptjs' />

declare namespace CodeceptJS {
    interface SupportObject {
        I: I;
    }
    interface Methods extends Playwright {}
    interface I extends WithTranslation<Methods> {}
    namespace Translation {
        interface Actions {}
    }
}
