import { Timestamp } from "firebase/firestore"

export type DocumentParams = {
    params: {
        id: string,
    }
}

export type UserData = {
    id: string,
    name: string,
    jokes: string[],
    image: string,
    following: string[],
    followers: string[],
    email: string,
    coins: number,
}

export type JokeData = {
    id: string,
    comments: string[],
    image: string | null,
    mainText: string | null,
    owner: string,
    punchline: string | null,
    timestamp: Timestamp,
    title: string,
    value: number,
    approveCount: number,
    approvers: string[],
}