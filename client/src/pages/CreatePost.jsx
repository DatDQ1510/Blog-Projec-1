import React from 'react'
import { TextInput, Label, Select, FileInput, Button } from 'flowbite-react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
export default function CreatePost() {
    return (
        <div className='p-3 max-w-3xl mx-auto min-h-screen'>
            <h1 className='text-center text-3xl fond-semibold'>Create a new post</h1>
            <form className='flex flex-col gap-4'>
                <div className='flex flex-col gap-4 my-7 sm:flex-row justify-between'>
                    <TextInput id='title' placeholder='Title' type='text' required
                        className='flex-1' />
                    <Select>
                        <option value='uncategorized'>Select a category</option>
                        <option value='football'>Football</option>
                        <option value='basketball'>Basketball</option>
                        <option value='biliard'>Biliard</option>
                        <option value='swimming'>Swimming</option>
                    </Select>
                </div>
                <div className='flex gap-4 items-center justify-between 
                border-4 border-teal-500 border-dotted p-3' >
                    <FileInput id='image' accept='image/*' />

                    <Button type='button' gradientDuoTone='purpleToBlue' size='sm' outline>Upload image</Button>
                </div>
                {/* <div>
                    <Label>Content</Label>
                    <textarea id='content' placeholder='Content' required
                        className='w-full h-48 p-3 border border-gray-300 rounded-md' />
                </div> */}
                <ReactQuill theme='snow' placeholder='Write something...' className='h-72 mb-12' required/>
                <Button type='submit' gradientDuoTone='purpleToPink'>Publish</Button>
            </form>
        </div>
    )
}
