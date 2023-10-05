import React, { useState, useEffect } from 'react';
import { WC } from "./WC.jsx";
import useAxios, { configure } from 'axios-hooks'
// import LRU from 'lru-cache'
import Axios from 'axios'
// import useAxios from 'axios-hooks'
import { useUpdateLayoutEffect } from 'ahooks';
const axios = Axios.create({
    baseURL: 'http://nas.zhijianstudio.ink',
    method: "PUT",
    charset: 'utf-8',
    headers: {
        'Content-Type': 'application/json',
        // 'Authorization': 'Token ' + token
    }

})
// const cache = new LRU({ max: 10 })

configure({ axios })
export function GuessEditor(props) {
    const [{ data, loading, error }, putGuessData] = useAxios("/data/",{ manual: true })
    useUpdateLayoutEffect(()=>{
        let text=""
        for (let t in props.pinyiner) {
            text+=props.pinyiner[t].contents
        }
        // 获取数据
        console.info("上传数据",text)


        putGuessData({

            data: {
                textIndex: props.index,
                owner: 'test',
                textContents: text,
                pin:props.char.rubyString,
                char:props.char.contents,
            },
            // params: {
            //     item_id : props.char.contents
            //   },
        })
    },[props.char.rubyString])

    
    if (error){
        console.log(error)}
    return (
        <WC>
            {loading && <p>Loading...</p>}
            {error && <p>Error!!!</p>}
            {/* {data && <p>ok</p>} */}
        </WC>
    )
}