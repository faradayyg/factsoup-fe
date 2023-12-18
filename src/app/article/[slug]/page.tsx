"use client"

import { useCallback, useEffect, useState } from "react"
import { remark } from "remark"
import html from "remark-html"
import "../../../styles/article.css"
import Footer from "@/components/Footer"
import "@/styles/custom.css"


const API_URL = process.env.NEXT_PUBLIC_API_URL;


console.log(API_URL, "API URL!")

interface ArticleObject {
    id: number;
    token_hash: number;
    token: string;
    generated_article: string;
    name: string;
    date: Date;
}

const fetchArticle = async (slug: string): Promise<ArticleObject> => {
    const articleId = slug.split("-").slice(-1);
    const url = `${API_URL}article/${articleId}/`;
    const request = await fetch(url, {
        method: "GET",
    })
    const response = await request.json()
    return response
}


const LoadingSpinner = () => {
    return (
        <div className="w-full px-3 mx-auto sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl xxl:max-w-xxl">
            <div role="status" className="max-w-sm animate-pulse">
            <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px] mb-2.5"></div>
            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[330px] mb-2.5"></div>
            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[300px] mb-2.5"></div>
            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
            <span className="sr-only">Loading...</span>
            </div>
        </div>
    )
}

const MetaSection = ({article} : {article: ArticleObject|undefined}) => {
    const date = article?.date ? new Date(article.date) : new Date()
    return (
        <section>
            <div className="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600 d-inline">
                <svg className="absolute w-12 h-12 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
            </div> {article?.name}
            <div>
                <small>{date.toDateString()}</small>
            </div>
            <hr />
        </section>
    )
}

const CommentSection = () => {
    return (
        <>
            <form action="" className="w-full">
                <h3>Comment</h3>
                <input className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" type="text" placeholder="Name" />
                <textarea className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" placeholder="Enter your comment"></textarea>
            </form>
        </>
    )
}


export default function Article({params}: { params: { slug: string }} ) {
    const [article, setArticle] = useState<ArticleObject>()
    const [loading, setLoading] = useState<boolean>(true)
    const [articleHtml, setArticleHtml] = useState<string>("")


    const internalFetchArticle = useCallback(async () => {
        setLoading(true)
        const article = await fetchArticle(params.slug);
        setArticle(article)
        const processedArticle = await remark().use(html).process(article.generated_article);
        setArticleHtml(processedArticle.toString())
        setLoading(false);

    }, [params.slug])
    useEffect(() => {
        internalFetchArticle()
    },[internalFetchArticle])
    return (
        <>
            {
                loading ? <LoadingSpinner /> :
                <div className="article-section w-full px-3 mx-auto sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl xxl:max-w-xxl">
                    <MetaSection article={article} />
                    <div dangerouslySetInnerHTML={{__html: articleHtml}} />
                    <CommentSection />
                </div>

            }
            <Footer />
        </>
    )
}