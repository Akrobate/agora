<template>
    <v-select
        v-model="access_level"
        :items="access_level_list"
        item-text="label"
        item-value="id"
        :label="$t('access_level_field_label')"
        :rules="access_level_rules"
    ></v-select>
</template>

<script>
import { USER_ACCESS_LEVEL } from '@/constants'

export default {
    name: 'MemberAccessLevelSelectElement',
    props: {
        value: Number,
    },
    data() {
        return {
            email_rules: [
                (value) => !!value || this.$t('validation_required_email'),
            ],
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
        }
    },
    async mounted() {
    },
    watch: {
        access_level() {
            this.$emit('input', this.access_level)
        },
        value() {
            this.access_level = this.value
        },
    },
}
</script>

<i18n locale='fr'>
{
    "access_label_none": "Aucun",
    "access_label_manager": "Manager",
    "access_label_observer": "Observateur",
    "validation_access_level_must_be_provided": "Un niveau d'accès doit être renseigné",
    "access_level_field_label": "Privilèges"
}
</i18n>
