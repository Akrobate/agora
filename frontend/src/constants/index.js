'use strict';

const CAMPAIGN_STATUS = {
    DRAFT: 1,
    IN_PROGRESS: 2,
    FINISHED: 3,
};

const CAMPAIGN_USER_STATUS = {
    INVITED: 1,
    STARTED: 2,
    RESULT_SUBMITED: 3,
};

const USER_ACCESS_LEVEL = {
    NONE: 1,
    OBSERVER: 2,
    MANAGER: 3,
};

export {
    CAMPAIGN_USER_STATUS,
    CAMPAIGN_STATUS,
    USER_ACCESS_LEVEL
};
