'use strict';

// @todo: How to use i18n in simple js file

const propositionType = {
    RAW_STRING: 'raw_string',
    MARKDOWN: 'markdown',
}

const propositionTypes = [
    {
        description: 'One line proposition',
        label: 'Raw string',
        type: 'raw_string',
    },
    {
        description: 'One line and description',
        label: 'Markdown',
        type: 'markdown',
    },
]


export {
    propositionTypes,
    propositionType,
}
