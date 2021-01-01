<template>
    <b-card border-variant="secondary" style="min-width: 35em; background-color: whitesmoke; margin-left: 0px; margin-right: 0">
        <b-row>
            <b-col style="text-align: start" cols="3"><h4><strong>Who</strong></h4></b-col>
            <b-col cols="1" v-for="player in players" :key="player.character.name">
                <div>{{ player.name.split('', 1).join('') }}</div>
            </b-col>
        </b-row>
        <b-row v-for="card in table.who" :key="card.id">
            <b-col style="text-align: start" cols="3">{{ card.name }}</b-col>
            <b-col cols="1" v-for="player in card.players" :key="player.pos">
                <div v-if="player.value === ' '">
                    <b-icon-square></b-icon-square>
                </div>
                <div v-else-if="player.value === '/'">
                    <b-icon-square-fill variant="danger"></b-icon-square-fill>
                </div>
                <div v-else-if="player.value === 'O'">
                    <b-icon-square-fill variant="success"></b-icon-square-fill>
                </div>
            </b-col>
            <b-col cols="3" v-if="card.isTheOne">
                <b-icon-star-fill variant="warning"></b-icon-star-fill>
            </b-col>
            <b-col cols="3" v-else>
                <b-icon-blank></b-icon-blank>
            </b-col>
        </b-row>
        <hr style="border-color: inherit">
        <b-row>
            <b-col style="text-align: start" cols="3"><h4><strong>What</strong></h4></b-col>
        </b-row>
        <b-row v-for="card in table.what" :key="card.id">
            <b-col style="text-align: start" cols="3">{{ card.name }}</b-col>
            <b-col cols="1" v-for="player in card.players" :key="player.pos">
                <div v-if="player.value === ' '">
                    <b-icon-square></b-icon-square>
                </div>
                <div v-else-if="player.value === '/'">
                    <b-icon-square-fill variant="danger"></b-icon-square-fill>
                </div>
                <div v-else-if="player.value === 'O'">
                    <b-icon-square-fill variant="success"></b-icon-square-fill>
                </div>
            </b-col>
            <b-col cols="3" v-if="card.isTheOne">
                <b-icon-star-fill variant="warning"></b-icon-star-fill>
            </b-col>
            <b-col cols="3" v-else>
                <b-icon-blank></b-icon-blank>
            </b-col>
        </b-row>
        <hr style="border-color: inherit">
        <b-row>
            <b-col style="text-align: start" cols="3"><h4><strong>Where</strong></h4></b-col>
        </b-row>
        <b-row v-for="card in table.where" :key="card.id">
            <b-col style="text-align: start" cols="3">{{ card.name }}</b-col>
            <b-col cols="1" v-for="player in card.players" :key="player.pos">
                <div v-if="player.value === ' '">
                    <b-icon-square></b-icon-square>
                </div>
                <div v-else-if="player.value === '/'">
                    <b-icon-square-fill variant="danger"></b-icon-square-fill>
                </div>
                <div v-else-if="player.value === 'O'">
                    <b-icon-square-fill variant="success"></b-icon-square-fill>
                </div>
            </b-col>
            <b-col cols="3" v-if="card.isTheOne">
                <b-icon-star-fill variant="warning"></b-icon-star-fill>
            </b-col>
            <b-col cols="3" v-else>
                <b-icon-blank></b-icon-blank>
            </b-col>
        </b-row>
    </b-card>
</template>

<script>
    export default {
        name: "Table",
        props: {
            table: Object,
            players: Array
        }
    }
</script>

<style scoped>

</style>