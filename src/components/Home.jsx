import React, { useState, useRef } from 'react';
import pinyin from "pinyin";

import { WC } from "./WC.jsx";
import { PinyinInput, app } from "./PinyinInput.jsx";
import { PinyinWeb } from "./PinyinWeb.jsx";
import "./Home.css";


function getAppSelection(range) {
    if (!range) {
        var range = "selection"
    }
    let myArray = [];
    let myTitles = [];
    let selectRange = ["Word", "Character", "Text","Line"]
    

    //严格化选区
    if (app.selection.length > 0 && range == "selection") {
        const configs=app.findGrepPreferences
        app.findGrepPreferences=1851876449 
        console.log("配置",configs)
        app.findGrepPreferences.findWhat = "~K+";


        var mySelection = app.selection;
        var myString = "";
        for (var myCounter = 0; myCounter < mySelection.length; myCounter++) {
            myString = mySelection[myCounter].constructor.name
            if (selectRange.indexOf(myString) !== -1) {
                // console.log(myString);


                myTitles = mySelection[myCounter].findGrep()
                for (let i = 0; i < myTitles.length; i++) {
                    for (var m = 0; m < myTitles[i].characters.length; m++) {
                        // myTitles[i].characters.item(m).addEventListener("select",) 
                        myArray.push(myTitles[i].characters.item(m))

                    }
                }
            }
        }
        console.log(myString);
        return [myTitles, myArray];

    } else if (range == "document") {
        const doc = app.activeDocument;
        myTitles = doc.findGrep()
        for (let i = 0; i < myTitles.length; i++) {
            for (var m = 0; m < myTitles[i].characters.length; m++) {
                // myTitles[i].characters.item(m).addEventListener("select",) 
                myArray.push(myTitles[i].characters.item(m))

            }
        }
    
        return [myTitles, myArray]
    } else {
        return [myTitles, myArray]
    }


    console.log("查找到的文本", myArray);
    return [myTitles, myArray];
}

export const Home = () => {
    const [pinyiner, setPinyiner] = useState(getSelection());
    const [range, setRange] = useState("selection");
    // const pinyiner = useRef(getSelection());
    // if (app.documents.length > 0) {
    //     let doc = app.activeDocument
    //     doc.addEventListener("afterSelectionChanged", IDselectionReNew);

    // }
    function addPinyin(range) {
        console.log("range?", range);

        var myTitles = getAppSelection(range)[0];
        //展开？
        myTitles
        // app.findGrepPreferences.findWhat = "~K+";
        // if (app.selection.length > 0 && range == "selection") {
        //     myTitles = app.selection[0].findGrep()
        // } else if (range == "document") {
        //     const doc = app.activeDocument;
        //     myTitles = doc.findGrep()
        // } else {
        //     return
        // }
        console.log("查找到的title文本", myTitles);
        for (let i = 0; i < myTitles.length; i++) {

            // if (myTitles[i].constructorName != "Word" || "Text" || "Character"||"Line") {
            //     console.log("被忽略了吗？", myTitles[i].constructorName);
            //     continue
            // }
            var pinyinchars = pinyin(myTitles[i].contents, {
                heteronym: true,              // 启用多音字模式
                segment: true,                // 启用分词，以解决多音字问题。默认不开启，使用 true 开启使用 nodejieba 分词库。
            })
            // console.log("字符长度", pinyinchars)
            if (myTitles[i].constructorName ==  "Character") {
                myTitles[i].rubyFlag = true;
                console.log("拼音数据", pinyinchars)
                myTitles[i].rubyString=pinyinchars[0][0]
                
                continue
            }

            for (var m = 0; m < myTitles[i].characters.length; m++) {
                // console.log("字符", myTitles[i].characters.item(m))
                myTitles[i].characters.item(m).rubyFlag = true;
                // alert(pinyinchars[m])
                myTitles[i].characters.item(m).rubyString = pinyinchars[m][0];
                // console.log("拼音", myTitles[i].characters.item(m))

            }

            // }
        }

    }



    function getSelection() {
        console.log("获取选区", getAppSelection("selection"))
        return getAppSelection("selection")[1]

    }
    function handleSelectionChange() {
        try {
            setPinyiner(getSelection())
        } catch (error) {
            console.log(error)
        }

        // console.log("选区变化", pinyiner.current)
    }

    function handleClick() {

        addPinyin(range)
    }

    function handleChange(event) {
        setRange(event.target.value)
        // console.log("选择的项目", event.target.value)
    }
    return (
        <div>
            <WC>
                {/* <p className="display">Congratulations! You just created your first React Plugin.!!!!!</p> */}

                <sp-button variant="primary" onClick={handleClick}>生成拼音</sp-button>
                
                <PinyinWeb getAppSelection={getAppSelection}></PinyinWeb>

                <sp-divider size="medium"></sp-divider>
                <sp-radio-group selected="selection" onClick={(e) => handleChange(e)}>
                    <sp-label slot="label">生成范围</sp-label>

                    <sp-radio value="document" >文档</sp-radio>
                    <sp-radio value="selection" Checked="true">选区</sp-radio>
                </sp-radio-group>
                <sp-divider size="medium"></sp-divider>

                <sp-button variant="primary" onClick={handleSelectionChange}>载入选区</sp-button>
                <PinyinInput className="display" pinyiner={pinyiner} setSelection={handleSelectionChange} setPinyiner={setPinyiner} getAppSelection={getAppSelection} />
            </WC>
        </div>
    );
}
