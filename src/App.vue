<template>
    <div id="app">
        <h1>Cluedo</h1>
        <b-container v-if="!isSetUp">
            <!--Setting up-->
            <label>Add the players, including yourself</label>
            <br>
            <b-button block v-if="numberOfPlayers !== 6" v-on:click="addPlayer" pill>
                <b-icon-plus-circle></b-icon-plus-circle>
            </b-button>
            <br>
            <b-card style="background-color: whitesmoke">
                <b-form-row>
                    <b-col cols="2" v-for="player in players" :key="player.position">
                        <b-card :style="'background-color: ' + player.character.colour">
                            <b-row>
                                <b-col align-self="start">
                                    <h2>
                                        <b-badge pill variant="info">{{ player.position }}</b-badge>
                                    </h2>
                                </b-col>
                                <b-col align-self="end">
                                    <h3>
                                        <b-button v-if="numberOfPlayers > 2" v-on:click="removePlayer(player.position)"
                                                  variant="danger" pill>
                                            <b-icon-x-circle></b-icon-x-circle>
                                        </b-button>
                                    </h3>
                                </b-col>
                            </b-row>
                            <b-form-input :id="'name-input' + player.position" v-model="player.name" trim
                                          placeholder="Enter name"></b-form-input>
                            <b-form-select v-model="player.character" :options="characters"></b-form-select>
                        </b-card>
                    </b-col>
                </b-form-row>
            </b-card>
            <br>
            <b-button pill variant="info" v-on:click="setUp" id="start-btn">Start</b-button>
        </b-container>
        <b-container style="text-align: Left; margin-left: 0; margin-right: 0; max-width: fit-content" v-else>
            <b-row>
                <b-col cols="5">
                    <!--Table-->
                    <b-card style="background-color: whitesmoke; margin-left: 5px; margin-right: 0">
                        <b-row>
                            <b-col cols="3"><h4><strong>Who</strong></h4></b-col>
                            <b-col cols="1" v-for="player in players" :key="player.character">{{ player.name.split('', 1).join('') }}</b-col>
                        </b-row>
                        <b-row v-for="card in table.who" :key="card.id">
                            <b-col cols="3">{{ card.name }}</b-col>
                            <b-col cols="1" v-for="player in card.players" :key="player">[{{ player }}]</b-col>
                            <b-col cols="3" v-if="card.isTheOne">isTheOne</b-col>
                            <b-col cols="3" v-else-if="card.isFound">isFound</b-col>
                        </b-row>
                        <b-row>
                            <b-col cols="3"><h4><strong>What</strong></h4></b-col>
                        </b-row>
                        <b-row v-for="card in table.what" :key="card.id">
                            <b-col cols="3">{{ card.name }}</b-col>
                            <b-col cols="1" v-for="player in card.players" :key="player">[{{ player }}]</b-col>
                            <b-col cols="3" v-if="card.isTheOne">isTheOne</b-col>
                            <b-col cols="3" v-else-if="card.isFound">isFound</b-col>
                        </b-row>
                        <b-row>
                            <b-col cols="3"><h4><strong>Where</strong></h4></b-col>
                        </b-row>
                        <b-row v-for="card in table.where" :key="card.id">
                            <b-col cols="3">{{ card.name }}</b-col>
                            <b-col cols="1" v-for="player in card.players" :key="player">[{{ player }}]</b-col>
                            <b-col cols="3" v-if="card.isTheOne">isTheOne</b-col>
                            <b-col cols="3" v-else-if="card.isFound">isFound</b-col>
                        </b-row>
                    </b-card>
                </b-col>
                <b-col>
                    <b-card>
                        <!--Main Menu-->
                        <h2>Angus's turn</h2>
                    </b-card>
                    <hr>
                    <!--Players-->
                    <b-card>
                        <b-card-group v-for="player in players" :key="player.position">
                            <b-card>
                                {{ player }}
                            </b-card>
                        </b-card-group>
                    </b-card>
                    <!--Rumours-->
                    <b-card>
                        <b-card-group v-for="rumour in rumours" :key="rumour.id">
                            <b-card>
                                {{ rumour }}
                            </b-card>
                        </b-card-group>
                    </b-card>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
    import 'bootstrap-vue/dist/bootstrap-vue.css'
    import {characters, weapons, rooms} from './constants';

    export default {
        name: 'App',
        data() {
            return {
                field: [
                    {
                        key: 'name'
                    },
                    {
                        key: 'players',
                        label: ''
                    },
                    {
                        key: 'isTheOne',
                        label: ''
                    },
                    {
                        key: 'isFound',
                        label: ''
                    }
                ],
                characters: characters,
                weapons: weapons,
                rooms: rooms,
                isSetUp: false,
                isSolved: false,
                numberOfPlayers: 2,
                cardsPerPerson: 9,
                myPosition: '',
                activePlayerName: '',
                solution: [
                    {
                        name: '',
                        id: null,
                        isTheOne: false,
                        isFound: false,
                        players: []
                    }
                ],
                nextId: 1,
                nextPosition: 3,
                rumours: [
                    {
                        id: null,
                        cards: [
                            {
                                name: '',
                                id: null,
                                isTheOne: false,
                                isFound: false,
                                players: []
                            }
                        ],
                        isWrong: false
                    }
                ],
                table: {
                    who: [
                        {
                            name: '',
                            id: null,
                            isTheOne: false,
                            isFound: false,
                            players: []
                        }
                    ],
                    what: [
                        {
                            name: '',
                            id: null,
                            isTheOne: false,
                            isFound: false,
                            players: []
                        }
                    ],
                    where: [
                        {
                            name: '',
                            id: null,
                            isTheOne: false,
                            isFound: false,
                            players: []
                        }
                    ]
                },
                players: [
                    {
                        name: '',
                        position: 1,
                        isMe: false,
                        character: characters[0].value,
                        cards: [
                            {
                                name: '',
                                id: null,
                                isTheOne: false,
                                isFound: false,
                                players: []
                            }
                        ]
                    }
                ]
            }
        },

        mounted() {
            this.solution = [];
            this.rumours = [];
            this.players[0].cards = [];
            this.players.push({
                name: '',
                position: 2,
                isMe: false,
                character: characters[1].value,
                cards: []
            });
            this.table.who = [];
            this.table.what = [];
            this.table.where = [];
        },

        watcher: {
            numberOfPlayers() {
                this.cardsPerPerson = Math.floor(18 / this.numberOfPlayers);
            }
        },

        methods: {
            addPlayer() {
                let character = this.freeCharacter();
                this.players.push({
                    name: '',
                    position: this.nextPosition,
                    isMe: false,
                    character: character,
                    cards: []
                });
                this.nextPosition++;
                this.numberOfPlayers++;
            },
            removePlayer(position) {
                for (let i = position - 1; i < this.players.length; i++) {
                    this.players[i].position--;
                }
                this.players.splice(position - 1, 1);
                this.nextPosition--;
                this.numberOfPlayers--;
            },
            freeCharacter() {
                let character;
                let player;
                let taken;
                for (let i = 0; i < characters.length; i++) {
                    character = characters[i].value;
                    taken = false;
                    for (let j = 0; j < this.players.length; j++) {
                        player = this.players[j];
                        if (player.character.name === character.name) {
                            taken = true;
                            break;
                        }
                    }
                    if (!taken) {
                        return character;
                    }
                }
                return {name: 'No characters left', colour: 'No characters left'}
            },
            validatePlayers() {
                let checkList = characters;
                for (let i = 0; i < checkList.length; i++) {
                    checkList[i].count = 0;
                    for (let j = 0; j < this.players.length; j++) {
                        if (checkList[i].value.name === this.players[j].character.name) {
                            checkList[i].count += 1;
                        }
                    }
                    if (checkList[i].count > 1) {
                        return false;
                    }
                }
                return true;
            },
            setUpCards(cardTypes) {
                let cards = [];
                for (let i = 0; i < cardTypes.length; i++) {
                    cards.push({
                        name: cardTypes[i].value.name,
                        id: this.nextId,
                        isTheOne: false,
                        isFound: false,
                        players: Array(this.numberOfPlayers).fill(' ')
                    });
                    this.nextId++;
                }
                return cards;
            },
            setUp() {
                if (!this.validatePlayers()) {
                    return;
                }
                this.isSetUp = true;
                this.table.who = this.setUpCards(this.characters);
                this.table.what = this.setUpCards(this.weapons);
                this.table.where = this.setUpCards(this.rooms);
            },
        }
    }
</script>

<style>
    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 20px;
    }
</style>
