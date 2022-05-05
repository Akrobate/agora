'use strict';

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
