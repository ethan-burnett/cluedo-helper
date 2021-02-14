<template>
    <b-card border-variant="secondary" style="min-width: 35em; background-color: whitesmoke; margin-left: 0px; margin-right: 0">
        <b-row>
            <b-col style="text-align: start" cols="3"><h4><strong>Who</strong></h4></b-col>
            <b-col cols="1" v-for="player in players" :key="player.character.name">
                <div>{{ player.name.split('', 1).join('') }}</div>
            </b-col>
        </b-row>
        <table-row-set :cards="table.who" :assignedManually="assignedManually" @undo-assign-card="undoAssignCard"/>
        <hr style="border-color: inherit">
        <b-row>
            <b-col style="text-align: start" cols="3"><h4><strong>What</strong></h4></b-col>
        </b-row>
        <table-row-set :cards="table.what" :assignedManually="assignedManually" @undo-assign-card="undoAssignCard"/>
        <hr style="border-color: inherit">
        <b-row>
            <b-col style="text-align: start" cols="3"><h4><strong>Where</strong></h4></b-col>
        </b-row>
        <table-row-set :cards="table.where" :assignedManually="assignedManually" @undo-assign-card="undoAssignCard"/>
    </b-card>
</template>

<script>
import TableRowSet from './TableRowSet.vue';
    export default {
  components: { TableRowSet },
        name: "Table",
        props: {
            table: Object,
            players: Array,
            assignedManually: Array
        },
        methods: {
            undoAssignCard(id) {
                this.$emit("undo-assign-card", id);
            }
        }
    }
</script>

<style scoped>

</style>