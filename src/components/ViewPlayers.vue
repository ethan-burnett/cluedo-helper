<template>
    <b-card-group columns style="column-count: 4">
        <b-card v-for="player in players" :key="player.position" no-body
                :style="'background-color: ' + player.character.colour" border-variant="secondary">
            <b-card-header>
                <b-badge pill variant="warning">{{ player.position }}</b-badge>
                <b-badge>{{ player.cards.length }}/{{ cardsPerPerson }}</b-badge>
                <br>
                <h3>{{player.name}}</h3></b-card-header>
            <b-list-group flush>
                <b-list-group-item v-for="card in player.cards" :key="card.id"
                                   style="background-color: inherit; border-color: inherit">
                    {{ card.name }}
                </b-list-group-item>
            </b-list-group>
        </b-card>
    </b-card-group>
</template>

<script>
    export default {
        name: "ViewPlayers",
        props: {
            players: Array,
            cardsPerPerson: Number
        }
    }
</script>

<style scoped>

</style>