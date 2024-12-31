import React, { useState, useContext, useEffect } from "react";
import { AiFillLike } from "react-icons/ai";
import { Avatar, Modal } from "flowbite-react";
import { AuthContext } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
export default function Comment({ postId }) {
  const [comments, setComments] = useState([]); // Danh sách bình luận
  const [comment, setComment] = useState(""); // Nội dung bình luận
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString()); // Thời gian hiện tại
  const [openModal, setOpenModal] = useState(false); // Trạng thái modal
  const [editComment, setEditComment] = useState(""); // Bình luận đang chỉnh sửa
  const [editIndex, setEditIndex] = useState(null); // Chỉ số bình luận đang chỉnh sửa
  const { userInfo } = useContext(AuthContext); // Lấy thông tin người dùng từ context
  const navigate = useNavigate(); // Dùng để điều hướng
  const id_user = userInfo.id;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    // Dọn dẹp khi component bị hủy
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/comment/get-comments-by-post-id/${postId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch comments");
        }
        const result = await response.json();
        setComments(result);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách bình luận:", error);
        alert("Đã xảy ra lỗi khi lấy danh sách bình luận");
      }
    };
    fetchComments();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userInfo) {
      alert("Bạn cần đăng nhập để bình luận");
      navigate("/sign-in");
      return;
    }

    const newComment = {
      content: comment, // Nội dung bình luận
      postId: postId, // ID bài viết
      userId: id_user, // ID người dùng
      likes: [], // Mảng likes ban đầu

    };

    try {
      const response = await fetch("/api/comment/create-comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`, // Thêm token nếu cần
        },
        body: JSON.stringify(newComment),
      });

      const result = await response.json();
      if (response.ok) {
        setComments((prevComments) => [...prevComments, result.comment]);
        setComment(""); // Reset nội dung bình luận
      } else {
        alert(result.message || "Đã có lỗi xảy ra");
      }
    } catch (error) {
      console.error("Lỗi khi gửi bình luận:", error);
      alert("Đã xảy ra lỗi khi gửi bình luận");
    }
  };

  const handleLikeToggle = async (index) => {
    const newComments = [...comments];
    const comment = newComments[index];

    // Kiểm tra xem user đã like hay chưa
    if (comment.likes.includes(userInfo._id)) {
      // Nếu đã like thì bỏ user khỏi danh sách
      comment.likes = comment.likes.filter((id) => id !== userInfo._id);
    } else {
      // Nếu chưa like thì thêm user vào danh sách
      comment.likes.push(userInfo._id);
    }

    try {
      // Gửi yêu cầu cập nhật API
      const response = await fetch(`/api/comment/edit-like-comment/${comment._id}`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${userInfo.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ likes: comment.likes }), // Truyền likes dưới dạng mảng
      });

      const result = await response.json();

      if (response.ok) {
        // Cập nhật trạng thái comment sau khi API thành công
        setComments(newComments);
      } else {
        console.error("Failed to update likes:", result.error || "Unknown error");
        alert("Đã xảy ra lỗi khi cập nhật lượt thích.");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật bình luận:", error);
      alert("Đã xảy ra lỗi khi cập nhật lượt thích.");
    }
  }; 

  const handleDelete = async (index) => {
    const comment = comments[index];
    if (!window.confirm("Bạn có chắc muốn xóa bình luận này không?")) return;

    try {
      const response = await fetch(`/api/comment/delete-comment/${comment._id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${userInfo.token}`,
        },

      });

      const result = await response.json();

      if (response.ok) {
        // Nếu xóa thành công, cập nhật lại danh sách bình luận
        const newComments = comments.filter((_, i) => i !== index);
        setComments(newComments);
      } else {
        // Nếu có lỗi xảy ra
        alert(result.error || "Đã có lỗi xảy ra");
      }
    } catch (error) {
      console.error("Lỗi khi xóa bình luận:", error);
      alert("Đã xảy ra lỗi khi xóa bình luận");
    }
  };

  const handleSaveEdit = async () => {
    const newComments = [...comments];
    newComments[editIndex] = {
      ...newComments[editIndex],
      content: editComment, // Cập nhật nội dung bình luận
    };

    try {
      // Thực hiện gửi yêu cầu PATCH để cập nhật bình luận
      const response = await fetch(`/api/comment/edit-comment/${newComments[editIndex]._id}`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${userInfo.token}`,
          "Content-Type": "application/json", // Đảm bảo rằng bạn gửi dữ liệu dưới dạng JSON
        },
        body: JSON.stringify({ content: editComment }), // Gửi nội dung mới của bình luận
      });

      const result = await response.json();

      // Kiểm tra nếu có lỗi trong phản hồi từ server
      if (!response.ok) {
        throw new Error(result.message || "Failed to update comment");
      }

      // Cập nhật danh sách bình luận với nội dung mới
      setComments(newComments);
      setOpenModal(false);

      // Thông báo thành công
      confirm("Đã cập nhật bình luận thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật bình luận:", error);
      alert("Đã xảy ra lỗi khi cập nhật bình luận.");
    }
  };


  return (
    <div className="w-1/2 mx-auto p-6 bg-white shadow-xl rounded-lg">

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
            onChange={(e) => setComment(e.target.value)}
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
        {comments.map((comment, index) => (
          <li
            key={index}
            className="bg-gray-100 p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex p-4 border-b dark:border-gray-600 text-sm text-gray-500">
              <Avatar rounded size="sm" />
              <span className="text-lg font-semibold text-gray-800">{comment.username}</span>
              <span className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(comment.updatedAt), { addSuffix: true })}
              </span>
            </div>
            <p className="mt-2 text-xl text-gray-800">{comment.content}</p>
            <hr className="my-4 border-t-2 border-gray-300" />
            <div className="flex items-center gap-6">
              <button
                className={`flex items-center text-xl transition duration-300 ${comment.likes.includes(userInfo._id) ? "text-blue-500" : "text-gray-500"}`}
                onClick={() => handleLikeToggle(index)}
              >
                <AiFillLike className="w-6 h-6 mr-2" />
                <span>{comment.likes.length} Thích</span>
              </button>
              {(userInfo?.isAdmin || id_user === comment.userId) && (
                <button
                  className="text-red-700 hover:text-white hover:bg-red-500 transition duration-300 ease-in-out px-4 py-2 rounded-md shadow-md"
                  onClick={() => handleDelete(index)}
                >
                  Xóa
                </button>
              )}
              {id_user === comment.userId && (
                <button
                  className="text-blue-700 hover:text-white hover:bg-blue-500 transition duration-300 ease-in-out px-4 py-2 rounded-md shadow-md"
                  onClick={() => {
                    setOpenModal(true);
                    setEditComment(comment.content); // Dữ liệu chỉnh sửa
                    setEditIndex(index);
                  }}
                >
                  Sửa
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
      <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h2 className="text-xl text-blue-600">Chỉnh sửa bình luận</h2>
            <textarea
              id="editComment"
              name="editComment"
              value={editComment}
              onChange={(e) => setEditComment(e.target.value)}
              className="w-full p-3 border rounded-md"
            />
            <div className="flex justify-end gap-4 mt-4">
              <button onClick={() => setOpenModal(false)} className="text-gray-500 hover:text-gray-700">
                Hủy
              </button>
              <button
                onClick={handleSaveEdit}
                className="text-blue-500 hover:text-white hover:bg-blue-500 px-4 py-2 rounded-md"
              >
                Lưu
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
