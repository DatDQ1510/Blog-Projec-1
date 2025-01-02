import React, { useState } from 'react';
import { TextInput, Select, FileInput, Button, Alert } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom'; // Sử dụng navigate để điều hướng

export default function CreatePost() {
    const [formData, setFormData] = useState({});
    const [file, setFile] = useState(null);
    const [publishError, setPublishError] = useState(null);
    const navigate = useNavigate(); // Khai báo navigate từ react-router-dom

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log('Submitting form data:', formData);

            const res = await fetch('/api/post/create', {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // Kiểm tra mã trạng thái HTTP
            if (!res.ok) {
                throw new Error(`Error: ${res.status}`);
            }

            const data = await res.json();

            console.log('Response data:', data);

            if (!data.success) {
                // Hiển thị lỗi từ API nếu có
                setPublishError(data.message || 'Failed to publish post');
                return;
            }

            // Reset lỗi nếu thành công
            setPublishError(null);

            // Kiểm tra và điều hướng tới bài viết mới
            navigate(`/post/${data.savePost.slug}`);

        } catch (error) {
            console.error('Error submitting post:', error);
            setPublishError(error.message || 'Something went wrong');
        }
    };


    return (
        <div className='p-3 max-w-3xl mx-auto min-h-screen'>
            <h1 className='text-center text-3xl font-semibold'>Create a new post</h1>
            <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                <div className='flex flex-col gap-4 my-7 sm:flex-row justify-between'>
                    <TextInput
                        id='title'
                        placeholder='Title'
                        type='text'
                        required
                        className='flex-1'
                        onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                        }
                    />
                    <Select
                        onChange={(e) =>
                            setFormData({ ...formData, category: e.target.value })
                        }
                        required
                    >
                        <option value='uncategorized'>Select a category</option>
                        <option value='football'>Football</option>
                        <option value='basketball'>Basketball</option>
                        <option value='billiard'>Billiard</option>
                        <option value='swimming'>Swimming</option>
                    </Select>
                </div>
                <div
                    className='flex gap-6 items-center justify-between border-4 border-teal-500 border-dotted p-3'
                >
                    {/* <FileInput
                        id='image'
                        accept='image/*'
                        onChange={(e) => setFile(e.target.files[0])}
                    /> */}
                    <form onSubmit={handleSubmit} className="flex items-center gap-4">
                        <TextInput
                            id="imageAlt"
                            placeholder="Image alt text"
                            type="text"
                            className="flex-grow w-96"
                            onChange={(e) => setFormData({ ...formData, imageAlt: e.target.value })}
                        />
                        {/* <Button
                            type="button"
                            gradientDuoTone="purpleToBlue"
                            size="sm"
                            outline
                            onClick={handleUploadImage} // Hàm xử lý tải lên
                        >
                            Upload image
                        </Button> */}
                        <Button
                            type="submit" // Nút này dùng để gửi form
                            gradientDuoTone="greenToBlue"
                            size="sm"
                            className="ml-2"
                        >
                            Submit
                        </Button>
                    </form>

                </div>
                <ReactQuill
                    theme='snow'
                    placeholder='Write something...'
                    className='h-72 mb-12'
                    required
                    onChange={(value) =>
                        setFormData({ ...formData, content: value })
                    }
                />
                <Button type='submit' gradientDuoTone='purpleToPink'>
                    Publish
                </Button>
            </form>
            {publishError && (
                <Alert color='failure' className='mt-5'> {publishError} </Alert>
            )}
        </div>
    );
}
