import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Card from "../components/Card";
import LoadingSpinner from "../components/LoadingSpinner";
import { bool } from "prop-types";
import Pagination from "./Pagination";

const BlogList = ({ isAdmin }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const pageParam = params.get("page");
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [numberOfPosts, setNumberOfPosts] = useState(0);
    const [numberOfPages, setNumberOfPages] = useState(0);
    const limit = 5;

    useEffect(() => {
        setNumberOfPages(Math.ceil(numberOfPosts / limit));
    }, [numberOfPosts]);

    const onClickPageButton = (page) => {
        navigate(`/admin?page=${page}`);
        getPosts(page);
    }

    const getPosts = useCallback((page = 1) => {
        let params = {
            _page: page,
            _limit: limit,
            _sort: "id",
            _order: "desc",
        }

        if (!isAdmin) {
            params = { ...params, publish: true }
        }

        axios.get(`http://localhost:3001/posts`, {
            params
        }).then((res) => {
            setNumberOfPosts(res.headers['x-total-count']);
            setPosts(res.data);
            setLoading(false); // 응답이 오면 로딩은 false!
        })
    }, [isAdmin]);

    useEffect(() => {
        setCurrentPage(parseInt(pageParam) || 1);
        getPosts(parseInt(pageParam) || 1);
    }, [pageParam, getPosts])

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

    if (loading) { // 로딩이 있으면 Loading Spinner를 보여주고
        return <LoadingSpinner />
    }

    if (posts.length === 0) { // 만약 로딩이 끝났는데 보여줄게 없으면 안내문구
        return (<div>No blog posts found</div>)
    }

    const renderBlogList = () => {
        return posts.map(post => { // 그 외에는 목록을 보여주는 함수 'renderBlogList'
            return (
                // 컴포넌트 누르면 해당 포스트 id로 이동 ***
                <Card key={post.id} title={post.title} onClick={() => { navigate(`/blogs/${post.id}`) }}>
                    {isAdmin ? <div>
                        <button className="btn btn-danger btn-sm"
                            onClick={(e) => deleteBlog(e, post.id)} >
                            Delete
                        </button>
                    </div> : null}
                </Card>
            );
        })
    }

    return (
        <div>
            {renderBlogList()}
            {numberOfPages > 1 && <Pagination
                currentPage={currentPage}
                numberOfPages={numberOfPages}
                onClick={onClickPageButton}
            />}
        </div>
    )
};

BlogList.propTypes = {
    isAdmin: bool
}

BlogList.defaultProps = {
    isAdmin: false
}

export default BlogList;