import React, { useState, useEffect, useContext } from 'react';
import { TextInput, Select, FileInput, Button, Alert } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

export default function UpdatePost() {
    const { userInfo } = useContext(AuthContext);
    const [formData, setFormData] = useState({});
    const [file, setFile] = useState(null);
    const [updateError, setUpdateError] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Trạng thái loading
    const navigate = useNavigate();
    const { slug } = useParams(); // Lấy slug từ URL

    // Fetch thông tin bài viết khi vào trang
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await fetch(`/api/post/getpostbyslug/${slug}`);
                const data = await res.json();

                if (res.ok && data.success) {
                    setFormData(data.post);
                } else {
                    setUpdateError(data.message || 'Post not found');
                }
            } catch (error) {
                setUpdateError('Something went wrong');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPost();
    }, [slug]);

    // Xử lý cập nhật bài viết
    const handleUpdate = async (e) => {
        e.preventDefault();
        
        const postId = formData._id;
        const userId = userInfo._id;

        // Tạo slug mới từ title (bạn có thể tùy chỉnh cách tạo slug)
        const newSlug = formData.title.toLowerCase().split(' ').join('-');

        // Gửi yêu cầu PUT để cập nhật bài viết, bao gồm slug mới
        const updatedData = { ...formData, slug: newSlug };

        try {
            const res = await fetch(`/api/post/updatepost/${postId}/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });

            const data = await res.json();

            if (!res.ok) {
                setUpdateError(data.message || 'Something went wrong');
                return;
            }
            window.confirm('Bạn có chắc muốn cập nhật bài viết này?')
            setUpdateError(null);
            navigate(`/post/${updatedData.slug}`);  // Dùng slug mới để chuyển hướng
        } catch (error) { 
            setUpdateError('Something went wrong');
            console.error('Error updating post:', error);
        }
    };

    // Xử lý xóa bài viết
    const handleDelete = async (postId, userId) => {
        if (window.confirm('Bạn có chắc muốn xóa bài viết này?')) {
            try {
                const res = await fetch(`/api/post/deletepost/${postId}/${userId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const data = await res.json();

                if (res.ok) {
                    alert('Bài viết đã được xóa thành công');
                    navigate('/dashboard?tab=dash');
                } else {
                    alert(data.message || 'Failed to delete post');
                }
            } catch (error) {
                console.error('Failed to delete post:', error);
                alert('Có lỗi xảy ra trong quá trình xóa bài viết');
            }
        }
    };

    if (isLoading) {
        return <div className="text-center text-lg">Loading...</div>;
    }

    return (
        <div className="p-3 max-w-3xl mx-auto min-h-screen">
            <h1 className="text-center text-3xl font-semibold">Update Post</h1>
            <form className="flex flex-col gap-4" onSubmit={handleUpdate}>
                <div className="flex flex-col gap-4 my-7 sm:flex-row justify-between">
                    <TextInput
                        id="title"
                        placeholder="Title"
                        type="text"
                        required
                        className="flex-1"
                        value={formData.title || ''}
                        onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                        }
                    />
                    <Select
                        value={formData.category || 'uncategorized'}
                        onChange={(e) =>
                            setFormData({ ...formData, category: e.target.value })
                        }
                        required
                    >
                        <option value="uncategorized">Select a category</option>
                        <option value="football">Football</option>
                        <option value="basketball">Basketball</option>
                        <option value="billiard">Billiard</option>
                        <option value="swimming">Swimming</option>
                    </Select>
                </div>

                <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
                    <FileInput
                        id="image"
                        accept="image/*"
                        onChange={(e) => setFile(e.target.files[0])}
                    />
                    <Button
                        type="button"
                        gradientDuoTone="purpleToBlue"
                        size="sm"
                        outline
                        onClick={() => alert('Feature not implemented yet')}
                    >
                        Upload image
                    </Button>
                </div>

                <ReactQuill
                    theme="snow"
                    placeholder="Write something..."
                    className="h-72 mb-12"
                    value={formData.content || ''}
                    required
                    onChange={(value) =>
                        setFormData({ ...formData, content: value })
                    }
                />

                <Button type="submit" gradientDuoTone="purpleToPink">
                    Update
                </Button>
                <Button
                    gradientDuoTone="purpleToBlue"
                    onClick={() => { handleDelete(formData._id, userInfo._id) }}
                >
                    Delete
                </Button>
            </form>

            {updateError && (
                <Alert color="failure" className="mt-5">
                    {updateError}
                </Alert>
            )}
        </div>
    );
}
