import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import LoadingSpinner from "../components/LoadingSpinner";
import { Link } from "react-router-dom";

const ShowPage = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null); // 처음에는 비어있다가
    const [loading, setLoading] = useState(true);

    const getPosts = (id) => {
        axios.get(`http://localhost:3001/posts/${id}`).then((res) => {
            setPost(res.data); // 서버와 통신해서 데이터를 받아옴
            setLoading(false); // 데이터 받아지면 loading은 false
        })
    };

    useEffect(() => {
        getPosts(id);
    }, []); // 여기 []는 의존성 배열!

    const printDate = (timestamp) => {
        return new Date(timestamp).toLocaleString();
    }

    if (loading) {
        return <LoadingSpinner />
    }

    return (
        <div>
            <div className="d-flex">
                <h1 className="flex-grow-1">{post.title}</h1>
                <div>
                    <Link className="btn btn-primary"
                        to={`/blogs/${id}/edit`}>
                        Edit
                    </Link>
                </div>
            </div>
            <small className="text-muted">
                Created at: {printDate(post.createdAt)}
            </small>
            <hr />
            <p>{post.body}</p>
        </div>
    );
};

export default ShowPage;