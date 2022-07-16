<template>
    <v-container>

        <managed-campaigns-element v-if="true" />

        <expected-participation-element />

    </v-container>
</template>

<script>
import ExpectedParticipationElement from '@/components/elements/dashboards/ExpectedParticipationElement'
import ManagedCampaignsElement from '@/components/elements/dashboards/ManagedCampaignsElement'
export default {
    name: 'HomePage',
    components: {
        ExpectedParticipationElement,
        ManagedCampaignsElement,
    },
    data: () => ({
        display_managed_campaigns: true,
    }),
}
</script>
