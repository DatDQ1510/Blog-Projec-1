import React from 'react'
import { TextInput, Label } from 'flowbite-react'
import { Button } from 'flowbite-react'
import { AuthContext } from '../AuthContext'
import { useContext } from 'react'
export default function Profile() {
    const { userInfo } = useContext(AuthContext)

    return (
        <div>
            <form>
                <div>
                    <Label >UserName: </Label>
                    <TextInput id="name" placeholder="Name" type="text" defaultValue={userInfo.username} />
                </div>
                <div>
                    <Label >Email: </Label>
                    <TextInput id="email" placeholder="email" type="email" defaultValue={userInfo.email} />
                </div>
                <div>
                    <Label >Password:</Label>
                    <TextInput id="password" placeholder="password" type="password" />
                </div>

            </form>
        </div>
    )
}
