<template>
    <div id="app">
        <h1>Cluedo</h1>
        <b-container v-if="!isSetUp">
            <!--Setting up-->
            <label>Add the players, including yourself</label>
            <br>
            <b-button block v-if="players.length !== 6" v-on:click="addPlayer" pill>
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
                                        <b-button v-if="players.length > 2" v-on:click="removePlayer(player.position)"
                                                  variant="danger" pill>
                                            <b-icon-x-circle></b-icon-x-circle>
                                        </b-button>
                                    </h3>
                                </b-col>
                            </b-row>
                            <b-form-input :id="'name-input' + player.position" v-model="player.name" trim
                                          placeholder="Enter name"></b-form-input>
                            <b-form-select v-model="player.character" :options="characters"></b-form-select>
                            {{ player.character }}
                        </b-card>
                    </b-col>
                </b-form-row>
            </b-card>
            <br>
            <b-button pill variant="info" v-on:click="setUp" id="start-btn">Start</b-button>
        </b-container>
        <b-container v-else>
            <b-row>
                <b-col cols="5">
                    <!--Table-->
                    <b-card>
                        {{ table }}
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
                </b-col>
                <b-col>
                    <b-card>
                        <!--Main Menu-->
                        <h2>Angus's turn</h2>
                    </b-card>
                    <hr>
                    <b-card>
                        <b-card-group v-for="rumour in rumours" :key="rumour.id">
                            <b-card>
                                <!--Rumours-->
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
                characters: characters,
                weapons: weapons,
                rooms: rooms,
                isSetUp: false,
                isSolved: false,
                numberOfPlayers: 4,
                cardsPerPerson: null,
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
                nextPosition: 2,
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
            this.players[0].cards = [];
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
            },
            removePlayer(position) {
                for (let i = position - 1; i < this.players.length; i++) {
                    this.players[i].position--;
                }
                this.players.splice(position - 1, 1);
                this.nextPosition--;
            },
            freeCharacter() {
                let character;
                let player;
                let taken;
                for (let i; i < characters.length; i++) {
                    character = characters[i].value;
                    taken = false;
                    for (let j; j < this.players.length; j++) {
                        player = this.players[j];
                        if (player.character.name === character.name) {
                            taken = true;
                            break;
                        }
                    }
                    if (taken) {
                        return character;
                    }
                }
                return {name: 'No characters left', colour: 'No characters left'}
            },
            setUp() {
                this.isSetUp = true;
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
        margin-top: 60px;
    }
</style>
