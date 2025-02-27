import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";
import jwt from 'jsonwebtoken'
import express, { Request, Response } from "express";
const client = new PrismaClient();
import dotenv from 'dotenv'
import { verifyToken } from "./middleware";

dotenv.config()
console.log(process.env.JWT_SECRET)
// async function createUser(){
    // await client.user.create({
    //     data: {
    //         username: "Ankitjha",
    //         password: "jhaankit209.",
    //         age: 21,
    //         city: 'Delhi'
    //     }
    // })
    // await client.user.delete({
    //     where: {
    //          id: 1
    //     }
    // })

    // const user = await client.user.findFirst({
    //     where: {
    //          id: 1
    //     },
    //     // if u want sepcific details for any row
    //     // then u can use select
    //     select:{
    //         username: true,
    //         password: true,
    //         // now it will only provide the username and password of the user
    //     }
    // })


    // await client.user.update({
    //     where: {
    //          id: 1
    //     },
    //    data: {
    //     username: "ankitjha209."
    //    }
    // })
    // console.log(user)
// }
// createUser();

const app = express();
app.use(express.json())

app.post('/signup',async (req: Request, res: Response) => {
    try {
        const {username, password, age, city} = req.body
        if(!username || !password || !age || !city){
            res.status(404).json({
                success: false,
                message: "All the things are mandatory"
            })
            return;
        }
        const userExist = await client.user.findFirst({
            where:{
                username
            }
        })

        if(userExist){
            res.status(401).json({
                success: false,
                message: "User already exist"
            })
            return
        }

        const hashPass = await argon2.hash(password)

        const response = await client.user.create({
            data:{
                username,
                password: hashPass,
                age,
                city
            }
        })

        res.status(200).json({
            success: true,
            message: "User Created Successfully",
            response
        })

        return
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
})

app.post('/login',async (req: Request, res: Response) => {
    try {
        const {username, password} = req.body
        if(!username || !password){
            res.status(404).json({
                success: false,
                message: "All the things are mandatory"
            })
            return;
        }
        const userExist = await client.user.findFirst({
            where:{
                username
            }
        })

        if(!userExist){
            res.status(401).json({
                success: false,
                message: "User does not exist"
            })
            return;
        }
        const dbPass = userExist?.password
        if(await argon2.verify(password, dbPass)){
            const payload = {
                id: userExist.id
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET as string)
            res.status(200).json({
                success: true,
                message: "Login Successfully",
                token
            })
            return;
        }
        else{
            res.status(402).json({
                success: false,
                message: "Password Incorrect"
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
})


app.post('/todo/addTodo', verifyToken, (req, res)=> {

})

app.listen(3000, ()=>{
    console.log(`Server running on Port: 3000`)
})

