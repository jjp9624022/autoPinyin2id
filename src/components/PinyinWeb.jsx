import React, { useState, useEffect } from 'react';
import { WC } from "./WC.jsx";
// import { useRequest } from 'ahooks';
// import { useAxios } from 'axioshook';
import useAxios from 'axios-hooks'


/**
 fixed :
  - no need to JSON.stringify to then immediatly do a JSON.parse
  - don't use export defaults, because default imports are hard to search for
  - axios already support generic request in one parameter, no need to call specialized ones
**/

export function PinyinWeb(props) {
    const [token, setToken] = useState(() => {
        // getting stored value
        const saved = localStorage.getItem("token");
        const initialValue = saved;
        return initialValue || "";
    });
    // const token = '2a90a87433a810afe6951c41e7e81e3e2696cfd2';
    const [{ data, loading, error }, executePost] = useAxios(
        {
            url: "http://nas.zhijianstudio.ink/pinyiners/",
            method: "POST",
            charset: 'utf-8',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Token ' + token
            }
        },
        { manual: true }
    )
    function updateToken(e) {
        // const newToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
        setToken(e.target.value)
        localStorage.setItem("token", e.target.value);
        // updateData()
        // setToken(newToken);
    }
    async function updateData() {
        let myTitles = props.getAppSelection(props.range)[0]

        console.log("查找到的文本", myTitles);


        for (let i = 0; i < myTitles.length; i++) {

            // if (myTitles[i].constructorName != "Word" | "Text" | "Character") {
            //     continue
            // }
            try {
                await executePost({

                    data: {
                        textIndex: i,
                        owner: 'test',
                        textContents: myTitles[i].contents,
                    },
                })
            } catch (error) {
                console.log(error)
            };


            // }
        }
    }
    console.log(data, loading, error)

    if (loading) return <p>服务器连接中</p>;
    if (error) return (
        <WC>
            <sp-divider size="medium">填写序列号</sp-divider>
            <sp-link href="http://www.zhijianstudio.ink/pinyin">获得序列号</sp-link>
            <input type="text" style={{ width: '80px' }} onChange={(e) => updateToken(e)} value={token} />
            <sp-button variant="primary" onClick={updateData}>服务器生成</sp-button>

            {/* <sp-button variant="primary" onClick={updateToken}>完成</sp-button> */}


        </WC>)
    if (data) {
        let pinyinchars = decodeURI(data.pinyinContents).split(" ")
        let myTitles = props.getAppSelection(props.range)[0]
        //这里其实可以合并
        if (myTitles[data.textIndex].constructorName == "Character") {
            myTitles[data.textIndex].rubyFlag = true;
            console.log("拼音数据", pinyinchars)
            myTitles[data.textIndex].rubyString = pinyinchars[0]


        }

        for (var m = 0; m < myTitles[data.textIndex].characters.length; m++) {
            // console.log("字符", myTitles[i].characters.item(m))
            myTitles[data.textIndex].characters.item(m).rubyFlag = true;
            // alert(pinyinchars[m])
            myTitles[data.textIndex].characters.item(m).rubyString = pinyinchars[m];
            // console.log("拼音", myTitles[i].characters.item(m))
            console.log(pinyinchars)
            // pinyinchars=[]

        }
        return (<WC>

            <sp-button variant="secondary" onClick={updateData}>服务器生成</sp-button>
            <pre>{data.pinyinContents}</pre>

        </WC>)

    }

    return (
        <WC>

            <sp-button variant="secondary" onClick={updateData}>服务器生成</sp-button>
            {/* <pre>{JSON.stringify(data)}</pre> */}

        </WC>

    )
}


