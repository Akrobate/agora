<template>
    <v-container>
        <campaign-list-element :campaign_status="campaign_status" />
    </v-container>
</template>

<script>

import CampaignListElement from '@/components/elements/campaign/CampaignListElement'

export default {
    name: 'CampaignListPage',
    props: {
        campaign_status: String,
    },
    components: {
        CampaignListElement,
    },
}
</script>
