<template>
    <v-card>

        <v-card-title>
            <span class="headline">{{ $t('title_member') }}</span>
        </v-card-title>

        <v-card-text>
            <v-container>

                <v-form
                    ref="form"
                    v-model="valid"
                    lazy-validation
                >
                    <v-text-field
                        v-model="email"
                        :counter="255"
                        :rules="email_rules"
                        :label="$t('email_field_label')"
                        required
                        :disabled="!creation_mode"
                    ></v-text-field>

                    <!--
                    <v-select
                        v-model="access_level"
                        :items="access_level_list"
                        item-text="label"
                        item-value="id"
                        :label="$t('access_level_field_label')"
                        :rules="access_level_rules"
                    ></v-select>
                    -->
                    <MemberAccessLevelSelectElement
                        v-model="access_level"
                    ></MemberAccessLevelSelectElement>
                </v-form>

                <v-switch
                    v-model="is_participant"
                    :label="$t('is_participant_field_label')"
                ></v-switch>

                
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
import { USER_ACCESS_LEVEL } from '@/constants'
import MemberAccessLevelSelectElement from '@/components/elements/campaign_members/MemberAccessLevelSelectElement'


export default {
    name: 'CampaignMembersCreateEditElement',
    props: {
        campaign_id: Number,
        campaign_user_id: Number,
    },
    components: {
        MemberAccessLevelSelectElement,
    },
    data() {
        return {
            valid: true,
            email: '',
            email_rules: [
                (value) => !!value || this.$t('validation_required_email'),
            ],
            is_participant: true,
            access_level: 0,
            access_level_list: [
                {
                    id: USER_ACCESS_LEVEL.NONE,
                    label: this.$t('access_label_none'),
                },
                {
                    id: USER_ACCESS_LEVEL.OBSERVER,
                    label: this.$t('access_label_observer'),
                },
                {
                    id: USER_ACCESS_LEVEL.MANAGER,
                    label: this.$t('access_label_manager'),
                },
            ],
            access_level_rules: [
                (value) => !! value || this.$t('validation_access_level_must_be_provided'),
            ],
            creation_mode: true,
        }
    },
    async mounted() {
        await this.init()
    },
    watch: {
        async campaign_id() {
            await this.init()
        },
        async campaign_user_id() {
            await this.init()
        },
    },
    methods: {

        ...mapActions({
            addCampaignUser: 'campaign_store/addCampaignUser',
            updateCampaignUser: 'campaign_store/updateCampaignUser',
            getCampaignUser: 'campaign_store/getCampaignUser',
        }),
        
        async init() {
            if (this.campaign_user_id) {
                this.creation_mode = false;
                const campaign_user = await this.getCampaignUser({ campaign_id: this.campaign_id, id: this.campaign_user_id })
                this.email = campaign_user.email
                this.access_level = campaign_user.access_level
                this.is_participant = campaign_user.is_participant
            } else {
                this.creation_mode = true;
                this.$refs.form.reset()
                this.is_participant = true
            }
        },

        async save () {

            if (!this.$refs.form.validate()) {
                this.$emit('validation_error')
                return;
            }

            if (this.campaign_user_id) {
                await this.updateCampaignUser({
                    id: this.campaign_user_id,
                    campaign_id: this.campaign_id,
                    data: {
                        access_level: this.access_level,
                        is_participant: this.is_participant,
                    }
                })
                this.$emit('saved')
                return;
            }
            await this.addCampaignUser({
                campaign_id: this.campaign_id,
                data: {
                    email: this.email,
                    access_level: this.access_level,
                    is_participant: this.is_participant,
                }
            })
            this.$emit('saved')
        },

        reset () {
            this.$refs.form.reset()
            this.$emit('reset')
        },

    },

}
</script>

<i18n locale='fr'>
{
    "title_member": "Membre",
    "access_label_none": "Aucun",
    "access_label_manager": "Manager",
    "access_label_observer": "Observateur",
    "validation_access_level_must_be_provided": "Un niveau d'accès doit être renseigné",
    "validation_required_email": "Le mail est obligatoire",
    "email_field_label": "Email",
    "access_level_field_label": "Privilèges",
    "is_participant_field_label": "Participe à la campagne",
    "cancel_button": "Annuler",
    "save_button": "Sauvegarder"
}
</i18n>
