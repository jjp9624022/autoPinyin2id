import React, { useState,useRef } from 'react';
import pinyin from "pinyin";

import { WC } from "./WC.jsx";
import { PinyinInput, app } from "./PinyinInput.jsx";
import "./Home.css";
function addPinyin(range) {
    // alert("on invoke");
    let myTitles;
    if (app.selection.length > 0||range=="selection") {
        app.findGrepPreferences.findWhat = "~K+";

        myTitles = app.selection[0].findGrep()
        console.log("选择的长度", myTitles)

    } else if (range == "document"){
        const doc = app.activeDocument;
        myTitles = doc.findGrep()
    }
    for (let i = 0; i < myTitles.length; i++) {
        // if (!myTitles[i].texts[0].rubyFlag) {
        // myTitles[i].texts[0].rubyFlag = false
        // alert("here")
        if (myTitles[i].constructorName != "Word" | "Text") {
            continue
        }
        var pinyinchars = pinyin(myTitles[i].contents, {
            heteronym: true,              // 启用多音字模式
            segment: true,                // 启用分词，以解决多音字问题。默认不开启，使用 true 开启使用 nodejieba 分词库。
        })
        console.log("字符长度", pinyinchars)

        for (var m = 0; m < myTitles[i].characters.length; m++) {
            console.log("字符", myTitles[i].characters.item(m))
            myTitles[i].characters.item(m).rubyFlag = true;
            // alert(pinyinchars[m])
            myTitles[i].characters.item(m).rubyString = pinyinchars[m][0];
            console.log("拼音", myTitles[i].characters.item(m))

        }

        // }
    }

}

export const Home = () => {
    const [pinyiner, setPinyiner] = useState(getSelection());
    const [range, setRange] = useState("");
    // const pinyiner = useRef(getSelection());
    function getSelection() {
        let myArray = [];
        let myTitles;
        if (app.selection.length > 0) {
            app.findGrepPreferences.findWhat = "~K+";

            myTitles = app.selection[0].findGrep()
            for (let i = 0; i < myTitles.length; i++) {
                for (var m = 0; m < myTitles[i].characters.length; m++) {
                    myArray.push(myTitles[i].characters.item(m))

                 }
            }
            console.log("选择的长度", myArray)

        }
        return myArray;
    }
    function handleSelectionChange() {
        setPinyiner(getSelection())
        // console.log("选区变化", pinyiner.current)
    }

    function handleClick() {
        
        addPinyin(range)
    }
    function handleChange(event) {
        setRange(event.target.value)
        console.log("选择的项目", event.target.value)
    }
    return (
        <div>
            <WC>
                {/* <p className="display">Congratulations! You just created your first React Plugin.!!!!!</p> */}

                <sp-button variant="primary" onClick={handleClick}>生成拼音</sp-button>
                <sp-divider size="medium"></sp-divider>
                <sp-radio-group onClick={(e) => handleChange(e)}>
                    <sp-label slot="label">生成范围</sp-label>

                    <sp-radio value="document" >文档</sp-radio>
                    <sp-radio value="selection" >选区</sp-radio>
                </sp-radio-group>
                <sp-divider size="medium"></sp-divider>

                <sp-button variant="primary" onClick={handleSelectionChange}>载入选区</sp-button>
                <PinyinInput className="display" pinyiner={pinyiner} setSelection ={handleSelectionChange} setPinyiner={setPinyiner} />
            </WC>
        </div>
    );
}
