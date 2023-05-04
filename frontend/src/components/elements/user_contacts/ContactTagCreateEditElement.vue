<template>
    <v-card>

        <v-card-title>
            <span class="headline">
                {{ $t('contacts_tag_title') }}
            </span>
        </v-card-title>

        <v-card-text>
            <v-container>
                <v-form
                    ref="form"
                    v-model="valid"
                    lazy-validation
                >
                    <div>
                        <v-text-field
                            v-model="tag_name"
                            :counter="255"
                            :rules="[rules.required]"
                            :label="$t('text_field_label')"
                            required
                        ></v-text-field>
                    </div>
                </v-form>
            </v-container>
        </v-card-text>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="blue darken-1"
                text
                @click="reset"
            >
                {{ $t('cancel_button') }}
            </v-btn>
            <v-btn
                color="blue darken-1"
                text
                @click="save"
            >
                {{ $t('save_button') }}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>


import { mapActions } from 'vuex'

export default {
    name: 'PropositionCreateEditElement',
    props: {
        contact_tag_id: Number,
    },
    data: () => ({
        valid: true,
        tag_name: '',
        contacts_tag: {},
        rules: {
            required: (value) => !!value || this.$t('validation_rule_required'),
        },
    }),
    async mounted() {
        await this.init()
    },
    watch: {
        contact_tag_id() {
            this.init()
        },
    },
    methods: {
        ...mapActions({
            createContactsTag: 'user_contact_tag_store/createProposition',
            updateContactsTag: 'user_contact_tag_store/updateProposition',
            getContactsTag: 'user_contact_tag_store/readProposition',
        }),
        async init() {
            if (this.contact_tag_id) {
                this.contacts_tag = await this.getContactsTag({
                    id: this.contact_tag_id
                })
                this.tag_name = this.contacts_tag.name
            }
        },
        async save() {
            if (!this.$refs.form.validate()) {
                this.$emit('validation_error')
                return
            }

            const data = {
                name: this.tag_name,
            }

            if (this.contact_tag_id) {
                await this.updateContactsTag(
                    {
                        id: this.contact_tag_id,
                        data,
                    }
                )
            } else {
                await this.createProposition(
                    {
                        data,
                    }
                )
            }
            this.$emit('saved')
            this.reset()
        },
        reset() {
            this.tag_name = ''
            this.$refs.form.reset()
            this.$emit('reset')
        },
    },
}
</script>

<i18n locale='fr'>
{
    "contacts_tag_title": "Liste de contacts",
    "cancel_button": "Annuler",
    "save_button": "Sauvegarder",
    "text_field_label": "Nom de la liste",
    "validation_rule_required": "Ce champ est obligatoire"
}
</i18n>