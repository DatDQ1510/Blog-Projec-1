import React, { useState, useEffect } from "react";
import { AiFillLike } from "react-icons/ai";
import { Avatar, Modal } from "flowbite-react";

export default function Comment() {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [liked, setLiked] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [editComment, setEditComment] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  // Cập nhật thời gian mỗi giây
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    // Dọn dẹp khi component bị hủy
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      setComments([...comments, { text: comment, time: currentTime }]);
      setComment("");
    }
  };

  const handleChange = (e) => {
    setComment(e.target.value);
  };

  const handleEditChange = (e) => {
    setEditComment(e.target.value);
  };

  const handleDelete = (index) => {
    alert("Bạn có chắc chắn muốn xóa bình luận này không?");
    const newComments = comments.filter((_, i) => i !== index);
    setComments(newComments);
  };

  function onCloseModal() {
    setOpenModal(false);
  }

  const handleSaveEdit = () => {
    const newComments = [...comments];
    newComments[editIndex] = { text: editComment, time: currentTime };
    setComments(newComments);
    setOpenModal(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-xl rounded-lg">
      <h2 className="text-2xl font-semibold text-center mb-4 text-blue-600">Bình luận</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="comment" className="block text-lg font-medium mb-2">
            Nhập bình luận:
          </label>
          <textarea
            id="comment"
            name="comment"
            value={comment}
            onChange={handleChange}
            rows="4"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md transition duration-300"
          >
            Gửi
          </button>
        </div>
      </form>
      <hr className="my-6" />
      <h2 className="text-2xl font-semibold text-center mb-4 text-blue-600">Danh sách bình luận</h2>
      <ul className="space-y-4">
        {comments.map((data_comment, index) => (
          <li key={index} className="bg-gray-100 p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center gap-2">
              <Avatar rounded />
              <span className="text-lg font-semibold text-gray-800">User</span>
              <span className="text-sm text-blue-700">{data_comment.time}</span>
            </div>
            <p className="mt-2 text-xl text-gray-800">{data_comment.text}</p>
            <hr className="my-4 border-t-2 border-gray-300" />
            <div className="flex items-center gap-6">
              <button
                className={`flex items-center text-xl transition duration-300 ${liked ? 'text-blue-500' : 'text-gray-500'}`}
                onClick={() => setLiked(!liked)}
              >
                <AiFillLike className="w-6 h-6 mr-2" />
                {liked && <span>Thích</span>}
              </button>
              <button
                className="text-red-700 hover:text-white hover:bg-red-500 transition duration-300 ease-in-out px-4 py-2 rounded-md shadow-md"
                onClick={() => handleDelete(index)}
              >
                Xóa
              </button>
              <button
                className="text-blue-700 hover:text-white hover:bg-blue-500 transition duration-300 ease-in-out px-4 py-2 rounded-md shadow-md"
                onClick={() => {
                  setOpenModal(true);
                  setEditComment(data_comment.text);
                  setEditIndex(index);
                }}
              >
                Sửa
              </button>
              <Modal show={openModal} size="md" onClose={onCloseModal} popup>
                <Modal.Header />
                <Modal.Body>
                  <div className="space-y-6">
                    <h2 className="text-xl text-blue-600">Chỉnh sửa bình luận</h2>
                    <textarea
                      id="editComment"
                      name="editComment"
                      value={editComment}
                      onChange={handleEditChange}
                      className="w-full p-3 border rounded-md"
                    />
                    <div className="flex justify-end gap-4 mt-4">
                      <button onClick={onCloseModal} className="text-gray-500 hover:text-gray-700">
                        Hủy
                      </button>
                      <button onClick={handleSaveEdit} className="text-blue-500 hover:text-white hover:bg-blue-500 px-4 py-2 rounded-md">
                        Lưu
                      </button>
                    </div>
                  </div>
                </Modal.Body>
              </Modal>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
