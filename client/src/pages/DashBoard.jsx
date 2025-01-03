import React, { useEffect, useState } from 'react';
import { HiAnnotation, HiArrowNarrowUp, HiDocumentText, HiOutlineUserGroup } from 'react-icons/hi';
import { Button, Table } from 'flowbite-react';
import { Link } from 'react-router-dom';

export default function DashboardComp() {
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);
  const [lastMonthComments, setLastMonthComments] = useState(0);

  // Giả lập dữ liệu
  useEffect(() => {
    // Hàm để lấy dữ liệu users
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/user/users', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        const data = await res.json();

        if (res.ok) {
          setTotalUsers(data.totalUsers || []);
          setUsers(data.users || []);
          setLastMonthUsers(data.lastMonthUsers || []);
          console.log(data);
        } else {
          setError(data.message || 'Failed to fetch users.');
          console.error('Error message:', data.message);
        }
      } catch (error) {
        setError('An error occurred while fetching users.');
        console.error('Fetch error:', error);
      }
    };

    // Gọi hàm fetchUsers một lần
    fetchUsers();
  }, []);
  useEffect(() => {
    // Hàm để lấy dữ liệu comments
    const fetchComments = async () => {
      try {
        const res = await fetch('/api/comment/get-total-comment', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        const data = await res.json();

        if (res.ok) {
          setTotalComments(data.totalComments || []);
          setComments(data.comments || []);
          setLastMonthComments(data.lastMonthComments || []);
          console.log(data);
        } else {
          setError(data.message || 'Failed to fetch comments.');
          console.error('Error message:', data.message);
        }
      } catch (error) {
        setError('An error occurred while fetching comments.');
        console.error('Fetch error:', error);
      }
    };

    // Gọi hàm fetchComments một lần
    fetchComments();
  }, []);

  useEffect(() => {
    // Hàm để lấy dữ liệu posts
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/post/getposts', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        const data = await res.json();
        console.log(data);

        if (res.ok) {
          setTotalPosts(data.totalPosts || []);
          setPosts(data.posts || []);
          setLastMonthPosts(data.lastMonthPosts || []);
          console.log(data);
        } else {
          setError(data.message || 'Failed to fetch posts.');
          console.error('Error message:', data.message);
        }
      } catch (error) {
        setError('An error occurred while fetching posts.');
        console.error('Fetch error:', error);
      }
    };

    // Gọi hàm fetchPosts một lần
    fetchPosts();
  }, []);

  return (
    <div className='p-3 md:mx-auto'>
      {/* Thống kê tổng số người dùng */}
      <div className='flex-wrap flex gap-4 justify-center'>
        <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
          <div className='flex justify-between'>
            <div className=''>
              <h3 className='text-gray-500 text-md uppercase'>Tổng người dùng</h3>
              <p className='text-2xl'>{totalUsers}</p>
            </div>
            <HiOutlineUserGroup className='bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg' />
          </div>
          <div className='flex gap-2 text-sm'>
            <span className='text-green-500 flex items-center'>
              <HiArrowNarrowUp />
              {lastMonthUsers}
            </span>
            <div className='text-gray-500'>1 tháng trước</div>
          </div>
        </div>

        {/* Thống kê tổng số bình luận */}
        <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
          <div className='flex justify-between'>
            <div className=''>
              <h3 className='text-gray-500 text-md uppercase'>Tổng bình luận</h3>
              <p className='text-2xl'>{totalComments}</p>
            </div>
            <HiAnnotation className='bg-indigo-600 text-white rounded-full text-5xl p-3 shadow-lg' />
          </div>
          <div className='flex gap-2 text-sm'>
            <span className='text-green-500 flex items-center'>
              <HiArrowNarrowUp />
              {lastMonthComments}
            </span>
            <div className='text-gray-500'>1 tháng trước</div>
          </div>
        </div>

        {/* Thống kê tổng số bài viết */}
        <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
          <div className='flex justify-between'>
            <div className=''>
              <h3 className='text-gray-500 text-md uppercase'>Tổng bài viết</h3>
              <p className='text-2xl'>{totalPosts}</p>
            </div>
            <HiDocumentText className='bg-lime-600 text-white rounded-full text-5xl p-3 shadow-lg' />
          </div>
          <div className='flex gap-2 text-sm'>
            <span className='text-green-500 flex items-center'>
              <HiArrowNarrowUp />
              {lastMonthPosts}
            </span>
            <div className='text-gray-500'>1 tháng trước</div>
          </div>
        </div>
      </div>

      {/* Bảng thống kê người dùng, bình luận, bài viết gần đây */}
      <div className='flex flex-wrap gap-4 py-3 mx-auto justify-center'>
        {/* Recent users */}
        <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800'>
          <div className='flex justify-between p-3 text-sm font-semibold'>
            <h1 className='text-center p-2'>Người dùng gần đây</h1>

            <Link to={'/admin-dashusers'}>
              <Button outline gradientDuoTone='purpleToPink'>Xem tất cả</Button>
            </Link>

          </div>
          <Table hoverable>
            <Table.Head>

              <Table.HeadCell>Người dùng</Table.HeadCell>
            </Table.Head>
            <Table.Body className='divide-y'>
              {users.slice(0, 4).map((user) => (
                <Table.Row key={user._id} className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                  <Table.Cell>{user.username}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>

        {/* Recent comments */}
        <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800'>
          <div className='flex justify-between p-3 text-sm font-semibold'>
            <h1 className='text-center p-2'>Bình luận gần đây</h1>
            <Link to={'/admin-dashcomments'}> <Button outline gradientDuoTone='purpleToPink'>
              See all
            </Button></Link>

          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Nội dung bình luận</Table.HeadCell>
              <Table.HeadCell>Likes</Table.HeadCell>
            </Table.Head>
            <Table.Body className='divide-y'>
              {comments.slice(0,4).map((comment) => (
                <Table.Row key={comment._id} className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                  <Table.Cell className='w-96'>
                    <p className='line-clamp-2'>{comment.content}</p>
                  </Table.Cell>
                  <Table.Cell>{comment.likes.length}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>

        {/* Recent posts */}
        <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800'>
          <div className='flex justify-between p-3 text-sm font-semibold'>
            <h1 className='text-center p-2'>Bài viết gần đây</h1>
            <Link to={'/admin-dashposts'}> <Button outline gradientDuoTone='purpleToPink'>
            See all
            </Button></Link>
           
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Ảnh bài viết</Table.HeadCell>
              <Table.HeadCell>Tiêu đề bài viết</Table.HeadCell>
              <Table.HeadCell>Loại bài viết</Table.HeadCell>
            </Table.Head>
            <Table.Body className='divide-y'>
              {posts.slice(0,4).map((post) => (
                <Table.Row key={post._id} className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                  <Table.Cell>
                    <img src={post.image} alt='post' className='w-10 h-10 rounded-md bg-gray-500' />
                  </Table.Cell>
                  <Table.Cell>{post.title}</Table.Cell>
                  <Table.Cell>{post.category}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </div>
    </div>
  );
}
