import React, { useState, useEffect } from 'react';
import { WC } from "./WC.jsx";
import TagsInput from 'react-tagsinput'

import 'react-tagsinput/react-tagsinput.css'
export function ChangeList(props) {
    // const [words, setWords] = useState({
    //     tags: []
    // })
    const [words, setWords] = useState(() => {
        // getting stored value
        const saved = localStorage.getItem(props.char.contents);
        const initialValue = JSON.parse(saved);
        return initialValue || {tags: []};
      });
      
    const [charIndex, setCharIndex] = useState({ length: 0, index: 0, chars: [] })

    useEffect(()=>{
        // 获取数据
        console.log("已经更改为",words)
        localStorage.setItem(props.char.contents, JSON.stringify(words));
        // props.getData(state.tags)
        findP()
    },[words.tags])

    const handleChange = (tags) => {
        console.log("原state和收到的tag",words,tags)
        setWords({ tags:tags })
        
        // 
        // console.log(findP())
    }
    function findP() {
        const app = props.app

        const char = props.char
        const range= props.range
        let result = []
        for (let i = 0; i < words.tags.length; i++) {

            let nn = new RegExp("(" + props.char.contents + ")");
            const chars = words.tags[i].split(nn).filter(item => item != '')
            const index = chars.indexOf(char.contents)
            let patten = ""
            for (let j = 0; j < chars.length; j++) {
                if (j < index) { patten += "(?<=" + chars[j] + ")"; }
                else if (j == index) { patten += chars[j]; }
                else if (j > index) { patten += "(?=" + chars[j] + ")"; }

            }
            console.log("生成的查找项", patten, chars)
            app.findGrepPreferences.findWhat = patten;
            //这里也做了例外
            result=result.concat(props.getAppSelection({theRange:range.theRange,patten:patten})[1])
            
        }
        setCharIndex({ length: result.length,index:charIndex.index,chars: result })
        console.log(result)
        return result
    }
    function selectNext() {
        console.log("参数",charIndex)
        const chars = charIndex.chars
        let myIndex= charIndex.index
        if (chars.length == 0) {
            return
        }
        props.app.select(chars[myIndex])
        // console.log("索引",myindex)
        if (myIndex < chars.length-1 ) {
            myIndex +=1;
        }else{
            setCharIndex({ length: 0, index: 0, chars: [] })
        }
        
        setCharIndex({ length:charIndex.length,index: myIndex,chars:charIndex.chars })
        console.log("改后参数",charIndex)



    }
    function changeOne(){
        const app =props.app
        const char=props.getAppSelection("selection")[1]
        char.rubyString=props.char.rubyString
    }
    function changeAndFind(){
        changeOne()
        selectNext()
    }

    function changeAll() {
        const chars = findP()
        for (let i = 0; i < chars.length; i++) {
            chars[i].rubyFlag = true;
            // alert(pinyinchars[m])
            chars[i].rubyString = props.char.rubyString
        }
    }

    return (
        <WC>
            <div className="change-list">
                <sp-label slot="label">按词组查找</sp-label>
                <TagsInput value={words.tags} onChange={handleChange} ></TagsInput>
                <sp-divider size="medium"></sp-divider>
                <sp-button slot="button" onClick={changeAll}>全部替换</sp-button>
                <sp-button slot="button" onClick={selectNext}>查找下一个</sp-button>
                <sp-button slot="button" onClick={changeOne}>替换</sp-button>
                <sp-button slot="button" onClick={changeAndFind}>替换/查找</sp-button>
            </div>

        </WC>
    )

}