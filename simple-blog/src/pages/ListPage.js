import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import { Link } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

const ListPage = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const getPosts = () => {
        axios.get("http://localhost:3001/posts").then((res) => {
            setPosts(res.data);
            setLoading(false); // 응답이 오면 로딩은 false!
        })
    }

    const deleteBlog = (e, id) => {
        e.stopPropagation(); // prevent event-bubbling
        axios.delete(`http://localhost:3001/posts/${id}`)
            .then(() => { // 성공적으로 delete될 경우 아래의 코드 실행
                setPosts(prevPosts => { // 기존 posts 목록에서
                    return prevPosts.filter(post => {
                        return post.id !== id; // post.id가 현재 삭제한 id와 다른 애들만!
                    })
                })
            });
    }

    useEffect(() => {
        getPosts();
    }, []);

    const renderBlogList = () => {
        if (loading) { // 로딩이 있으면 Loading Spinner를 보여주고
            return <LoadingSpinner />
        }

        if (posts.length === 0) { // 만약 로딩이 끝났는데 보여줄게 없으면 안내문구
            return (<div>No blog posts found</div>)
        }

        return posts.map(post => { // 그 외에는 목록을 보여주는 함수 'renderBlogList'
            return (
                // 컴포넌트 누르면 해당 포스트 id로 이동 ***
                <Card key={post.id} title={post.title} onClick={() => { navigate(`/blogs/${post.id}`) }}>
                    <div>
                        <button className="btn btn-danger btn-sm"
                            onClick={(e) => deleteBlog(e, post.id)} >
                            Delete
                        </button>
                    </div>
                </Card>
            )
        })
    }

    return (
        <div>
            <div className="d-flex justify-content-between">
                <h1>Blogs</h1>
                <div>
                    <Link to="/blogs/create" className="btn btn-success">
                        Create New
                    </Link>
                </div>
            </div>
            {renderBlogList()}
        </div >
    )
}

export default ListPage;