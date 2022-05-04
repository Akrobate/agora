<template>
    <div>

        <markdown-edition-element />
        
        <raw-string-edition-element />

    </div>
</template>

<script>

import MarkdownEditionElement from '@/components/elements/proposition/types/markdown/EditionElement'
import RawStringEditionElement from '@/components/elements/proposition/types/raw_string/EditionElement'


export default {
    name: 'CreateEditElement',
    components: {
        MarkdownEditionElement,
        RawStringEditionElement,
    },
    data: () => ({
        valid: true,
        payload: '',
        payload_rules: [
            v => !!v || 'Le contenu de la proposition est obligatoire',
        ],
    }),
}
</script>
