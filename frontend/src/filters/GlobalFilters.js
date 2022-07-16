import Vue from 'vue'
import moment from 'moment'

moment.locale('fr')

Vue.filter('formatDate', (value) => {
    if (value) {
        return moment(String(value)).format('DD/MM/YYYY')
    }
})

Vue.filter('humanizeDate', (value, threshold = 8) => {
    if (value) {
        if (moment().diff(moment(value), 'days') > threshold) {
            return `le ${moment(value).format('Do MMMM YYYY')}`
        }
        return `il y a ${moment(value).fromNow(true)}`
    }
})

Vue.filter('humanizeFutureDuration', (value) => {
    if (value) {
        return `${moment(value).toNow(true)}`
    }
})
