import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import { Link } from "react-router-dom";

const ListPage = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);

    const getPosts = () => {
        axios.get("http://localhost:3001/posts").then((res) => {
            setPosts(res.data);
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
            {posts.map(post => {
                return (
                    <Card key={post.id} title={post.title} onClick={() => { navigate("/blogs/edit") }}>
                        <div>
                            <button className="btn btn-danger btn-sm"
                                onClick={(e) => deleteBlog(e, post.id)} >
                                Delete
                            </button>
                        </div>
                    </Card>
                )
            })}
        </div >
    )
}

export default ListPage;