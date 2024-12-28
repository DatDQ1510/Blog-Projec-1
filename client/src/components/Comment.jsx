import React, { useState } from 'react';
import { Card, Textarea, Button } from 'flowbite-react';

const CommentSection = () => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    const handleAddComment = () => {
        if (newComment.trim()) {
            setComments([...comments, newComment]);
            setNewComment('');
        }
    };

    return (
        <div>
            <div className="mb-4">
                <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Thêm bình luận..."
                    rows={3}
                />
            </div>
            <Button onClick={handleAddComment}>Thêm bình luận</Button>
            <div className="mt-4">
                {comments.length > 0 ? (
                    comments.map((comment, index) => (
                        <Card key={index} className="mb-2">
                            <p>{comment}</p>
                        </Card>
                    ))
                ) : (
                    <p className="text-center">Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</p>
                )}
            </div>
        </div>
    );
};

export default CommentSection;
