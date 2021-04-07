const _ISLOGGEDKEY = "notesIsLogged";
const _USERLOGGEDKEY = "notesUserLogged";
const _DEFAULTPFP = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGMAAABeCAYAAAA336rmAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADlSURBVHhe7dExAQAwDMCgCWj9y+1scORAAW9mL4YyIGVAyoCUASkDUgakDEgZkDIgZUDKgJQBKQNSBqQMSBmQMiBlQMqAlAEpA1IGpAxIGZAyIGVAyoCUASkDUgakDEgZkDIgZUDKgJQBKQNSBqQMSBmQMiBlQMqAlAEpA1IGpAxIGZAyIGVAyoCUASkDUgakDEgZkDIgZUDKgJQBKQNSBqQMSBmQMiBlQMqAlAEpA1IGpAxIGZAyIGVAyoCUASkDUgakDEgZkDIgZUDKgJQBKQNSBqQMSBmQMiBlQMqAlAEpg7H3AU/beRBUx2yaAAAAAElFTkSuQmCC";

let _DATABASE=[{title: "test", body: "testingminefam", editable: false, id:0},
{title: "test1", body: "testingminefam1", editable: false, id:1},
{title: "test2", body: "testingminefam2", editable: false, id:2}];

let user_DATABASE=[{
    username: "affafu",
    email: "affafu@gmail.com",
    pfp: "default",
    nickname: null
}];

let login_DATABASE=[{
    username: "affafu",
    password: "affafuPass",
}]

let titleInput, bodyInput;
let userName, userPass, userEmail;
let pfpNickName;
let editable = false;
let clickingCheck = false;
let currentOpenID = null;
let currentUser = null;
let currentFile = null;

const terminal = (userEdit=false) => {
    closeBtnClicked(".noteMenu",userEdit);
    clearNotes();
    nodeLoad();
}

const logInUserValidate = () => {
    let returnVar = null;

    if(!userName||!userPass){
        alert("Please fill out area");
    }else{
        login_DATABASE.forEach(user=>{
            if(user.username === userName.toLowerCase()){
                if(user.password === userPass){
                    returnVar = user.username;
                }
            }
        })
        if(!returnVar){
            alert("Invalid username or password");
        }
    }
    return returnVar;
}

const userLogInOut = (loggingIn = true) => {
    const btn1 = document.querySelector(".loginBtn");
    const btn2 = document.querySelector(".loginRegisterMenuBtn:nth-child(2) button");
    const userPanel = document.querySelector("nav .userPanel");

    userPanel.classList.toggle("animAct");

    btn1.disabled = loggingIn;
    btn1.classList.toggle("hiddenSection");
    btn2.classList.toggle("registerBtn");
    btn2.classList.toggle("userPanelBtn");

    if(loggingIn){
        let nickName = searchUserDBASE('username',currentUser,'nickname');
        nickName['nickname'] ? btn2.textContent = nickName['nickname'] : btn2.textContent = currentUser;
    }else{
        checkingOpenedFrames();
        btn2.textContent = "Register";
    }
}

const registerUserValidate = () =>{
    let returnVar = true;

    if(!userName || !userPass || !userEmail) {
        returnVar=false;
        alert("Please fill out every textbox");
    }else{
        if(!passwordCheck(userPass)){
            returnVar=false;
            alert("Password needs to be 6 characters or longer and have one uppercase letter");
        }else{
            if(userName.length<=5){
                returnVar=false;
                alert("Username needs to be 6 characters or longer")
            }else{
                if(searchUserDBASE('username',userName)){
                    returnVar=false;
                }
                if(searchUserDBASE('email',userEmail)){
                    returnVar=false;
                }
                if(returnVar===false){
                    alert("User already exist!");
                }
            }
        }
    }

    return returnVar;
}

const passwordCheck = pass => {
    let returnVar = true;
    let upperCount = 0;
    let lowerCount = 0;

    if(pass.length<=5){
        returnVar = false;
    }else{
        [...pass].forEach(lett => {
            if(lett.toLowerCase() !== lett.toUpperCase()){
                if(lett === lett.toUpperCase()){
                    upperCount++;
                }
                if(lett === lett.toLowerCase()){
                    lowerCount++;
                }
            }
        });
        if(lowerCount<1 || upperCount<1){
            returnVar = false;
        }
    }


    return returnVar;
}

const registerUser = () => {
    let newUser = {
        username: userName.toLowerCase(),
        email: userEmail,
        pfp: "default",
        nickname: null
    }

    user_DATABASE.push(newUser);
    login_DATABASE.push({
        username: userName.toLowerCase(),
        password: userPass
    })
    confirm("User Registered!");
}

const userTerminal = () => {
    if(document.querySelector(".emailContainer").classList.contains("hiddenSection")){
        currentUser = logInUserValidate();
        if(currentUser){
            accountLogged(true);
            userLogInOut();
            closeBtnClicked(".loginRegisterMenu");
        }else{
            currentUser=null;
            clearInputs(".loginRegisterMenu")
        }
    }else{
        if(registerUserValidate()){
            registerUser();
            closeBtnClicked(".loginRegisterMenu");
        }else{
            clearInputs(".loginRegisterMenu");
        }
    }
}

const saveNote = () => {
    if(_DATABASE.length){
        id = _DATABASE[_DATABASE.length-1].id + 1;
    }else{
        id = 1;
    }
    _DATABASE.push({title: titleInput, body: bodyInput, editable, id});
    terminal();
}

const editNote = () => {
    _DATABASE.forEach(note=>{
        if(Number(currentOpenID.replace("note",""))===note.id){
            if(titleInput!==note.title){
                note.title=titleInput;
            }
            if(bodyInput!==note.body){
                note.body=bodyInput;
            }
        }
    })
    terminal(true);
}

const deleteNote = id => {
    closeBtnClicked(".noteMenu",true);
    _DATABASE = _DATABASE.filter(note=>note.id!==Number(id));
    clearNotes();
    nodeLoad();
}

const createNote = (title=null, body=null, id=null) => {
    const ul = document.querySelector(".mainArticle ul")
    const li = document.createElement("li");
    const h3 = document.createElement("h3");

    if(!id && id!==0){
        title="Double Click here!";
    }else{
        if(!title){
            title="No Title";
        }else if(!body){
            body="Note here";
        }
    }

    h3.textContent = title;
    li.appendChild(h3);

    if(id===null){
        li.classList.add("defaultNote");
        li.addEventListener("dblclick", clicked);
    }else{
        const pBody = document.createElement("p");
        li.setAttribute("id","note"+id);
        pBody.textContent = body;
        li.appendChild(pBody);
        li.classList.add("userNote");
        li.addEventListener("click",clicked);
    }

    li.classList.add("txtCen");
    ul.appendChild(li)
}

const clearNotes = () => {
    const lists = document.querySelectorAll(".mainArticle ul li");

    lists.forEach(list => {
        list.parentNode.removeChild(list);
    })
}

const nodeLoad = () => {
    if(_DATABASE){
        _DATABASE.forEach(item=>{
            createNote(item.title,item.body,item.id);
        })
    }
    createNote();
}

const clicked = e => {
    e.preventDefault();
    let btnClass = e.target.classList[0];
    const parent = e.target.parentNode;
    let nodeClass;

    if(btnClass==="addBtn" 
    || btnClass==="editBtn" 
    || btnClass==="closeBtn" 
    || btnClass==="delBtn"  
    || btnClass==="loginregisterFuncBtn" 
    || btnClass==="userPanelBtn" 
    || btnClass==="logOutBtn"
    || btnClass==="saveProfileBtn"
    || btnClass==="clearNickname"){
        nodeClass=btnClass;
    }else{
        if(parent.classList.contains("defaultNote")){
            nodeClass = ".noteMenu";
        }else if(parent.classList.contains("userNote")){
            nodeClass="userNote";
        }else{
            if(btnClass==="userSettingsBtn"){
                nodeClass = "." + btnClass.replace("Btn", "");
            }else{
                nodeClass = "." + parent.className.replace("Btn","");
            }
        }
    }

    if(nodeClass==="addBtn"){
        if(titleInput || bodyInput){
            saveNote();
        }else{
            window.alert("Please Enter a title or a body");
        }
    }else if(nodeClass==="editBtn"){
        editNote();
    }else if(nodeClass==="userNote"){
        currentOpenID=parent.id;
        menuClicked(".noteMenu",null,currentOpenID);
    }else if(nodeClass==="closeBtn"){
        if(parent.classList.contains("userEdit")){
            closeBtnClicked("."+ parent.classList[0], true);
        }else{
            closeBtnClicked("." + parent.classList[0]);
        }
    }else if(nodeClass==="delBtn"){
        if(confirm("Are you sure?")){
            deleteNote(currentOpenID.replace("note",""))
        }
    }else if(nodeClass==="loginregisterFuncBtn"){
        //log in button
        userTerminal();
    }else if(nodeClass==="userPanelBtn"){
        activePanel();
    }else if(nodeClass==="logOutBtn"){
        //log out button
        accountLogged(false);
        userLogInOut(false);
        activePanel();
    }else if(nodeClass==="saveProfileBtn"){
        saveProfile();
    }else if(nodeClass==="clearNickname"){
        pfpNickClear();
    }else{
        menuClicked(nodeClass,e.target.className);
    }
}

const checkingOpenedFrames = () => {
    document.querySelectorAll(".activeSection").forEach(section=>{
            if(section.classList.contains("userEdit")){
                closeBtnClicked("."+ section.classList[0], true);
            }else{
                closeBtnClicked("." + section.classList[0]);
            }
    })
}

const menuClicked = (nodeClass, registerClass=null, noteID=false) => {
    checkingOpenedFrames();

    if(nodeClass===".loginRegisterMenu"){
        if(registerClass==="registerBtn"){
            document.querySelector("section p button").textContent = "Register";
            document.querySelector("section .emailContainer input").disabled = false;
            document.querySelector("section .emailContainer").classList.toggle("hiddenSection");
            document.querySelector(nodeClass).classList.toggle("registerRN");
        }else{
            document.querySelector("section p button").textContent = "Log in";
        }
        document.querySelectorAll(`${nodeClass} p  input`).forEach(inp=>{
            if(inp.parentNode.classList[0]!==".emailContainer"){
                inp.disabled=false;
            }
        })
    }else if (nodeClass===".noteMenu"){
        const delBtn = document.querySelector(".delBtn");
        if(!noteID){
            delBtn.classList.add("hiddenSection");
            delBtn.disabled = true;
            activeNote(false, true);
        }else{
            const addBtn = document.querySelector(".addBtn");
            addBtn.classList.toggle("addBtn");
            addBtn.classList.toggle("editBtn");
            addBtn.textContent = "Edit";
            _DATABASE.forEach(note=>{
                if(Number(noteID.replace("note","")) === note.id){
                    document.querySelector(`${nodeClass} input`).value = titleInput = note.title;
                    document.querySelector(`${nodeClass} textarea`).value = bodyInput = note.body;
                    if(!note.editable){
                        document.querySelector(`${nodeClass} .extraInput p input`).checked = false;
                        activeNote();
                    }else{
                        document.querySelector(`${nodeClass} .extraInput p input`).checked = true;
                        activeNote(false, true);
                    }
                }
            })
            document.querySelector(".delBtn").disabled=false;
            delBtn.classList.remove("hiddenSection");
            document.querySelector(nodeClass).classList.toggle("userEdit");
        }
    }else if (nodeClass===".userSettings"){
        const userObj = searchUserDBASE('username',currentUser,'nickname','pfp');

        userObj['nickname'] ? pfpLabelChange(userObj['nickname']) : pfpLabelChange();

        if(userObj['pfp'] === "default"){
            pfpChange(_DEFAULTPFP);
            pfpEditCheck(false);
        }else{
            pfpChange(userObj['pfp']);
            pfpEditCheck(true);
        }
    }
        document.querySelector(nodeClass).classList.toggle("hiddenSection");
        document.querySelector(nodeClass).classList.toggle("activeSection");
}

const closeBtnClicked = (nodeClass,userEdit,initialize=false) => {
    if(nodeClass === ".loginRegisterMenu"){
        if(document.querySelector(nodeClass).classList.contains("registerRN") || initialize){
            document.querySelector("section .emailContainer").classList.toggle("hiddenSection");
            document.querySelector("section .emailContainer input").disabled = true;
            initialize ? "" : document.querySelector(nodeClass).classList.toggle("registerRN");
        }
        document.querySelectorAll(".loginRegisterMenu p input").forEach(inp=>inp.disabled=true);
    }else if(nodeClass === ".noteMenu"){
        if(userEdit){
            const addBtn = document.querySelector(".editBtn");
            addBtn.classList.toggle("editBtn");
            addBtn.classList.toggle("addBtn");
            addBtn.textContent = "Add Note";
            document.querySelector(".noteMenu").classList.toggle("userEdit");
        }
        activeNote(false,false);
    }

    clearInputs(nodeClass);

    if(initialize){
        document.querySelector(nodeClass).classList.toggle("hiddenSection");
    }else{
        document.querySelector(nodeClass).classList.toggle("hiddenSection");
        document.querySelector(nodeClass).classList.toggle("activeSection");
    }
}

const clearInputs = whichNode => {
    if(whichNode===".loginRegisterMenu"){
        document.querySelectorAll(`${whichNode} p input`).forEach(input=>input.value = "");
    }else if(whichNode===".userSettings"){
        pfpRemove(null);
        pfpLabelChange(null);
    }else{
        document.querySelector(`${whichNode} input`).value="";
        document.querySelector(`${whichNode} textarea`).value="";
        document.querySelector(`${whichNode} .extraInput p input`).checked = false;
        titleInput = "";
        bodyInput = "";
        editable = false;
        currentOpenID=null;
    }
}

const activeNote = (fromEdit=false, isActive = false) => {

    document.querySelector(".noteMenu input").disabled = !isActive;
    document.querySelector(".noteMenu textarea").disabled = !isActive;
    document.querySelector(".noteMenu .extraInput p button:first-child").disabled = !isActive;
    document.querySelector(".noteMenu").classList.toggle("nonEditable");

    if(fromEdit){
        _DATABASE.forEach(note => {
        if(Number(currentOpenID.replace("note",""))===note.id){
                note.editable = !note.editable;
        }
        })
    }
}

const activePanel = () => {
    const navNode = document.querySelector("nav .userPanel");

    if(navNode.classList.contains("panelActive")){
        navNode.classList.toggle("panelActive");
        navNode.classList.toggle("panelInactive");
    }else{
        if(navNode.classList.contains("panelInactive")){
            navNode.classList.toggle("panelActive");
        }
        navNode.classList.toggle("panelInactive");
    }
    
}

const checkLoggedAccount = () => {
    if(localStorage.getItem(_USERLOGGEDKEY)){
        searchUserDBASE('username', localStorage.getItem(_USERLOGGEDKEY)) ? currentUser = localStorage.getItem(_USERLOGGEDKEY) : localStorage.removeItem(_USERLOGGEDKEY);
    
        if(currentUser){
            userLogInOut();
        }else{
            currentUser=null;
            localStorage.removeItem(_USERLOGGEDKEY);
        }
    }
}

const accountLogged = isLogged => {
    isLogged ? localStorage.setItem(_USERLOGGEDKEY, currentUser) : localStorage.removeItem(_USERLOGGEDKEY);
}


const saveProfile = () => {
    if(currentFile){
        updateUserDBASE(currentUser,'pfp',currentFile);
    }
    if(pfpNickName){
        updateUserDBASE(currentUser,'nickname',pfpNickName);
        document.querySelector(".loginRegisterMenuBtn:nth-child(2) button").textContent = pfpNickName;
        document.querySelector("#nicknameInput").value="";
        pfpLabelChange(pfpNickName);
    }
}

const pfpUpload = e => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = e => {
        if(e.target.result){
            let fileStr = e.target.result.split(",");
            if(fileStr[0].includes("data:image/")){
                if(!fileStr[0].includes("gif")){
                    pfpChange(e.target.result);
                    pfpEditCheck(true);
                    currentFile=e.target.result;
                }else{
                    alert("Gif file prohibited");
                }
            }else{
                alert("not an image");
            }
        }
    }

    reader.onerror = e => {
        alert(e.target.error);
    }

    reader.readAsDataURL(file);
}

const pfpRemove = e => {
    let ans = e ?  ans = confirm("are you sure?") : true;

    if(ans){
        pfpChange(_DEFAULTPFP);
        pfpEditCheck(false);
        currentFile="default";
    }
}

const pfpEditCheck = userPfpEditable => {
    const pfpCon = document.querySelector(".userSettings p .pfpContainer");
    if(userPfpEditable){
        if(!pfpCon.classList.contains("pfpClickable")){
            pfpCon.classList.add("pfpClickable");
            pfpCon.addEventListener("click", pfpRemove);
        }
    }else{
        pfpCon.classList.remove("pfpClickable");
        pfpCon.removeEventListener("click",pfpRemove);
    }
}

const pfpChange = newPfP => {
    document.querySelector(".pfpContainer .pfp").src=newPfP;
}

const pfpNickClear = () => {
    updateUserDBASE(currentUser, 'nickname', null);
    pfpNickName=null;
    document.querySelector(".loginRegisterMenuBtn:nth-child(2) button").textContent = currentUser;
    document.querySelector("#nicknameInput").value="";
    pfpLabelChange();
}

const pfpLabelChange = (nick="none") => {
    const userNickNode = document.querySelector(".usernameNickname");
    
    if(nick){
        let textC = `${currentUser}`;
        
        if(nick!=="none"){
            textC+=`[${nick}]`   
        }

        userNickNode.textContent=textC;
    }else{
        userNickNode.textContent="Username/Nickname";
    }
}

const searchUserDBASE = (propName, propValue, opPropName=null, sndOpPropName=null) => {
    let returnVar=false;

    user_DATABASE.forEach(user=>{
        if(propValue===user[propName]){
            returnVar={[propName]:user[propName]};
            if(opPropName){
                returnVar[opPropName]=user[opPropName];
            }
            if(sndOpPropName){
                returnVar[sndOpPropName]=user[sndOpPropName];
            }
        }
    });

    return returnVar;
}

const updateUserDBASE = (username, propName, propValue) => {
    let returnVar = false;
    user_DATABASE.forEach(user=>{
        if(username===user.username){
            returnVar = true;
            user[propName] = propValue;
        }
    })

    return false;
}

window.onload = () =>{
    const sections = document.querySelectorAll("body section");
    const sectionCloseBtns = document.querySelectorAll("section .closeBtn");
    const logOutBtn = document.querySelector(".userPanel li .logOutBtn");
    //loginRegister
    const loginMenuBtn = document.querySelector("ul .loginRegisterMenuBtn .loginBtn");
    const registerMenuBtn = document.querySelector("ul .loginRegisterMenuBtn .registerBtn");
    const loginregisterFuncBtn = document.querySelector(".loginRegisterMenu p .loginregisterFuncBtn");
    const usernameInput = document.querySelector("#usernameInput");
    const passwordInput = document.querySelector("#passwordInput");
    const emailInput = document.querySelector("#emailInput");
    //note
    const addBtn = document.querySelector(".addBtn");
    const delBtn = document.querySelector(".delBtn");
    const titleBox = document.querySelector(".noteMenu input");
    const bodyBox = document.querySelector(".noteMenu textarea");
    const chckBox = document.querySelector(".noteMenu .extraInput p input");
    //userSettings
    const nicknameInput = document.querySelector("#nicknameInput");
    const userSettings = document.querySelector(".userSettingsBtn");
    const userpfpInput = document.querySelector("#userpfpInput");
    const saveProfileBtn = document.querySelector(".saveProfileBtn");
    const clearNickname = document.querySelector(".clearNickname");

    activePanel();
    sections.forEach(section=>{
        closeBtnClicked("."+section.classList[0],false,true);   
    });

    const insertInput = e => {
        if(e.target.classList.contains("titleBox")){
            titleInput = e.target.value;
        }else if(e.target.classList.contains("bodyBox")){
            bodyInput = e.target.value;
        }else if(e.target.id === "usernameInput"){
            userName = e.target.value;
        }else if(e.target.id === "passwordInput"){
            userPass = e.target.value;
        }else if(e.target.id === "emailInput"){
            userEmail = e.target.value;
        }else if(e.target.id === "nicknameInput"){
            pfpNickName = e.target.value;
        }
    }
    
    const checkingBox = e => {
        e.target.checked ? editable = true : editable = false;
        if(e.target.parentNode.parentNode.parentNode.classList.contains("userEdit")){
            activeNote(true,editable);
        }
    }

    const focusedTT = e => {
        e.target.parentNode.classList.toggle("focusTT");
    }

    [...sectionCloseBtns, logOutBtn, userSettings, loginMenuBtn, registerMenuBtn, loginregisterFuncBtn, addBtn, delBtn, saveProfileBtn, clearNickname].forEach(item=>item.addEventListener("click",clicked));
    [usernameInput, emailInput, passwordInput, titleBox, bodyBox, nicknameInput].forEach(item=>item.addEventListener("input",insertInput));

    //loginregister
    usernameInput.addEventListener("focus",focusedTT);
    passwordInput.addEventListener("focus",focusedTT);
    usernameInput.addEventListener("blur",focusedTT);
    passwordInput.addEventListener("blur",focusedTT);
    //note
    chckBox.addEventListener("change", checkingBox);
    //userSettings
    userpfpInput.addEventListener("change", pfpUpload);

    checkLoggedAccount();
    nodeLoad();
}