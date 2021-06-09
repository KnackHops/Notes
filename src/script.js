const _ISLOGGEDKEY = "notesIsLogged";
const _USERLOGGEDKEY = "notesUserLogged";
const _DEFAULTPFP = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGMAAABeCAYAAAA336rmAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADlSURBVHhe7dExAQAwDMCgCWj9y+1scORAAW9mL4YyIGVAyoCUASkDUgakDEgZkDIgZUDKgJQBKQNSBqQMSBmQMiBlQMqAlAEpA1IGpAxIGZAyIGVAyoCUASkDUgakDEgZkDIgZUDKgJQBKQNSBqQMSBmQMiBlQMqAlAEpA1IGpAxIGZAyIGVAyoCUASkDUgakDEgZkDIgZUDKgJQBKQNSBqQMSBmQMiBlQMqAlAEpA1IGpAxIGZAyIGVAyoCUASkDUgakDEgZkDIgZUDKgJQBKQNSBqQMSBmQMiBlQMqAlAEpg7H3AU/beRBUx2yaAAAAAElFTkSuQmCC";
const _CHANGESETPROP = ["userPfpChk", 'userNickChk', 'userMobileChk'];
const _INDEXEDDBNAME = "localUserNoteDB";
const _INDEXEDSTORENAME = ["localNotesOS", "noteImageOS"];

let _DATABASE=[{title: "test", body: "testingminefam", editable: false, id:0, user: "affafu", date: { month: 0, day: 25, year: 2021}, lastUpdated: { month: 3, day: 15, year: 2021}},
{title: "test1", body: "testingminefam1", editable: false, id:1, user: "affafu", date: { month: 2, day: 27, year: 2021}, lastUpdated: { month: 2, day: 29, year: 2021}},
{title: "test2", body: "testingminefam2", editable: false, id:0, user: "barrys", date: { month: 2, day: 28, year: 2021}, lastUpdated: null}];

let local_DATABASE = [{title: "testingminefam3", body: "testingminefam3", editable: false, id:0, user: "localUser", date: { month: 2, day: 25, year: 2020}, lastUpdated: null}]

let user_DATABASE=[{
    username: "affafu",
    email: "affafu@gmail.com",
    mobile: null,
    pfp: "default",
    nickname: "plop"
},{
    username: "barrys",
    email: "barry@gmail.com",
    mobile: null,
    pfp: "default",
    nickname: null
}];

let login_DATABASE=[{
    username: "affafu",
    password: "affafuPass",
},{
    username: "barrys",
    password: "barryPass",
}]

let titleInput, bodyInput;
let prevTitleInput, prevBodyInput;
let userName, userPass, userEmail;
let sideInput;
let userMobile, userNickName, userEditEmail;
let _userMobile, _userNickName;
let editable = false;
let saveLocalChk = false;
let clickingCheck = false;
let currentOpenID = null;
let currentUser = null;
let currentFile = null;
let changedSettingsChk = 
    {
        userPfpChk: false,
        userNickChk: false,
        userMobileChk: false
    }; 
let clickedChk = false;
let dbaseLoadChk = [false, false];

const terminal = (userEdit=false) => {
    closeBtnClicked(".noteMenu",userEdit);
    nodeLoad();
}

const orderList = whichOrder => {
    let newDbase = [];

    _DATABASE.forEach(item=>{
        if(item.user===currentUser){
            newDbase.push(item);
        }
    })

    local_DATABASE.forEach(item=>{
        if(item){
            newDbase.push(item);
        }
    })

    if(whichOrder==="ascendCreated"){
        nodeLoad(ascendCreated(newDbase));
    }else if(whichOrder==="descendCreated"){
        nodeLoad(descendCreated(newDbase));
    }else if(whichOrder==="ascendEdited"){
        nodeLoad(ascendEdited(newDbase));
    }else if(whichOrder==="descendEdited"){
        nodeLoad(descendEdited(newDbase));
    }else{
        nodeLoad();
    }
}

const ascendCreated = arrayDbase => {
    return arrayDbase.sort(
        function(a,b){
            return totalDate(a.date.day, a.date.month, a.date.year) - totalDate(b.date.day, b.date.month, b.date.year);
        }
    );
}

const descendCreated = arrayDbase => {
    return arrayDbase.sort(
        function(a,b){
            return totalDate(b.date.day, b.date.month, b.date.year) - totalDate(a.date.day, a.date.month, a.date.year);
        }
    );
}

const ascendEdited = arrayDbase => {
    return arrayDbase.sort(
        function(a,b){
            let aTotal, bTotal;

            aTotal = dateEditedCheck(a)
            bTotal = dateEditedCheck(b);

            return aTotal - bTotal;
        }
    )
}

const descendEdited = arrayDbase => {
    return arrayDbase.sort(
        function(a,b){
            let aTotal, bTotal;

            aTotal = dateEditedCheck(a)
            bTotal = dateEditedCheck(b);

            return bTotal - aTotal;
        }
    )
}

const dateEditedCheck = ({lastUpdated,date}) => {
    let total;

    if(lastUpdated){
        total = totalDate(lastUpdated.day, lastUpdated.month, lastUpdated.year);
    }else{
        total = totalDate(date.day, date.month, date.year);
    }

    return total;
}

const totalDate = (day, month,year) => {
    return ((day + ((month + 1) * 30.4) + (year * 365)))
}

const dateNowGet = () => {
    const d = new Date();
    let newDate = {};
    newDate.month = d.getMonth();
    newDate.day = d.getDate();
    newDate.year =  d.getFullYear();

    return newDate;
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
    const userNavBtns = document.querySelector("nav ul:nth-child(2)");


    userPanel.classList.toggle("animAct");

    btn1.disabled = loggingIn;
    btn1.classList.toggle("hiddenSection");
    btn1.parentNode.classList.toggle("disabled");
    userNavBtns.classList.toggle("loggedInUL");
    btn2.classList.toggle("registerBtn");
    btn2.classList.toggle("userPanelBtn");

    if(loggingIn){
        let user = searchUserDBASE('username',currentUser,'nickname','pfp');
        const imgCon = document.createElement("li");
        const imgIn = document.createElement("img");

        imgCon.classList.add("pfpContainer");
        imgCon.classList.add("nonProfilePfp");
        imgIn.setAttribute("alt","profile picture");
        imgIn.classList.add("pfp");

        imgCon.appendChild(imgIn);
        userNavBtns.appendChild(imgCon);

        user['nickname'] ? panelBtnChange(user.nickname) : panelBtnChange(currentUser);

        user['pfp'] === 'default' ? pfpNavChange(_DEFAULTPFP) : pfpNavChange(user['pfp']);
    }else{
        const imgCon = document.querySelector(".pfpContainer.nonProfilePfp");
        const imgIn = document.querySelector(".pfpContainer.nonProfilePfp .pfp");

        imgCon.removeChild(imgIn);
        imgCon.parentNode.removeChild(imgCon);

        btn2.textContent = "Register";
        currentUser=null;
    }
    nodeLoad();
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
            if(userName ==="localUser"){
                alert("Please pick a valid username");
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
    let id = null;
    let newDate = dateNowGet();
    let user;

    if(currentUser && !saveLocalChk){
        user = currentUser;

        _DATABASE.forEach(item=>{
            if(item.user===currentUser){
                id=item.id;
            }
        })
    }else{
        user = "localUser";

        local_DATABASE.forEach(item=>{
            if(item){
                id=item.id;
            }
        })
    }

    if(id || id===0){
        id+=1;
    }else{
        id=0;
    }

    if(user === "localUser"){
        // local_DATABASE.push({title: titleInput, body: bodyInput, editable, id, user, date: newDate});
        indexedDBTerminal(_INDEXEDSTORENAME[0], {title: titleInput, body: bodyInput, editable, user, date: newDate, lastUpdated: null}, "add").finally(terminal());
    }else{
        _DATABASE.push({title: titleInput, body: bodyInput, editable, id, user, date: newDate, lastUpdated: null});
        terminal();
    }
}

const editNote = () => {
    // editing note
    let id = currentOpenID;
        let titleInputVal = titleInput;
        let bodyInputVal = bodyInput;

        if(id.indexOf("note")===0){
            id = Number(currentOpenID.replace("note",""));
            _DATABASE.forEach(item=>{
                if(item.user===currentUser){
                    if(id===item.id){
                        [item.title, item.body, item.lastUpdated] = editAndCheck(item.title, item.body, titleInputVal, bodyInputVal);
                        terminal(true);
                    }
                }
            })
        }else{
            id = Number(currentOpenID.replace("localNote",""));
            indexedDBGetData(_INDEXEDSTORENAME[0], id).then(data=>{
                if(data){
                    data = data.target.result;
                    let oldUpdatedDate = data.lastUpdated;
                    [data.title, data.body, data.lastUpdated] = editAndCheck(data.title, data.body, titleInputVal, bodyInputVal);
                    if(data.lastUpdated){
                        if(data.lastUpdated !== oldUpdatedDate){
                            indexedDBTerminal(_INDEXEDSTORENAME[0], data, "edit").finally(terminal(true));
                        }
                    }
                }
            })
        }
    }

const editAndCheck = (title, body, titleInputVal, bodyInputVal) => {
    let edited=false;
    let lastUpdated=null;

    if(title!==titleInputVal){
        title=titleInputVal;
        edited=true;
    }

    if(body!==bodyInputVal){
        body=bodyInputVal;
        edited=true;
    }

    if(edited){
        lastUpdated = dateNowGet();
    }
    return [title, body, lastUpdated];
}

const deleteNote = () => {
    let id = currentOpenID;

    closeBtnClicked(".noteMenu",true);
    new Promise((resolve, reject) => {
        if(id.indexOf("note")==0){
            id = id.replace("note","");
            _DATABASE = _DATABASE.filter(item=>{
                if(currentUser===item.user){
                    if(item.id!==Number(id)){
                        return item;
                    }
                }else {
                    return item;
                }
            });
            resolve(true);
        }else{
            id = id.replace("localNote","");
            // local_DATABASE = local_DATABASE.filter(item=>item.id!==Number(id));
            indexedDBTerminal(_INDEXEDSTORENAME[0], Number(id), "del").finally(resolve(true));
        }
    }).then(nodeLoad())
}

const createNote = (title=null, body=null, id=null, userN=null) => {
    const ul = document.querySelector(".mainArticle .mainList")
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
        if(userN!=="localUser"){
            li.setAttribute("data-username", userN);
            li.setAttribute("id","note"+id);
        }else{
            li.setAttribute("data-username", userN);
            li.setAttribute("id","localNote"+id);
        }
        pBody.textContent = body;
        li.appendChild(pBody);
        li.classList.add("userNote");
        li.addEventListener("click",clicked);
    }

    // li.classList.add("txtCen");
    ul.appendChild(li)
}

const clearNotes = () => {
    const lists = document.querySelectorAll(".mainArticle ul li");

    lists.forEach(list => {
        list.parentNode.removeChild(list);
    })
}

const nodeLoad = (altDbase = null) => {
    clearNotes();

    if(altDbase){
        altDbase.forEach(item=>{
            createNote(item.title, item.body, item.id, item.user);
        })
        createNote();
    }else{
        let mainDBPromise = new Promise((resolve,reject)=>{
            if(_DATABASE){
                _DATABASE.forEach(item=>{
                    if(currentUser===item.user){
                        createNote(item.title, item.body, item.id, item.user);
                    }
                })
                resolve("done");
            }
        })

        Promise.allSettled([mainDBPromise, indexedDBGetAllNoteOS()]).then(resp=>{
            console.log(resp[0].value, resp[1].value);
        }).finally(e=>{
            createNote();
        })
    }
}

//clickedterminal
const clicked = e => {
    e.preventDefault();

    clickedChk = true;

    setTimeout(()=> clickedChk = false, 100);

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
    || btnClass==="clearNickname"
    || btnClass==="sidePanelBtn"){
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
        currentOpenID ? menuClicked(".noteMenu",null,currentOpenID) : "";
    }else if(nodeClass==="closeBtn"){
        if(parent.classList.contains("userEdit")){
            closeBtnClicked("."+ parent.classList[0], true);
        }else{
            closeBtnClicked("." + parent.classList[0]);
        }
    }else if(nodeClass==="delBtn"){
        if(confirm("Are you sure?")){
            deleteNote();
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
    }else if(nodeClass==="sidePanelBtn"){
        userMobileNickHandler();
    }else{
        if(nodeClass===".noteMenu"){
            currentOpenID = null;
        }
        menuClicked(nodeClass,e.target.className);
    }
}

const checkingOpenedFrames = () => {
    document.querySelectorAll("section.activeSection").forEach(section=>{
            if(section.classList.contains("userEdit")){
                closeBtnClicked("."+ section.classList[0], true);
            }else{
                closeBtnClicked("." + section.classList[0]);
            }
    })

    if(document.querySelector("aside.userSidePanel").classList.contains("activeSection")){
        menuClicked(".userSidePanel");
    }
}

// mainmenu handler
const menuClicked = (nodeClass, targetClass=null) => {
    nodeClass===".userSidePanel" ? "" : checkingOpenedFrames();

    if(!document.querySelector("ul.userPanel").classList.contains("panelInactive")){
        activePanel();
    }

    if(nodeClass===".loginRegisterMenu"){
        loginRegisterMenuPanelHandler(nodeClass, targetClass);
    }else if (nodeClass===".noteMenu"){
        noteMenuPanelHandler(nodeClass);
    }else if (nodeClass===".userSettings"){
        userSettingsPanelHandler(nodeClass);
    }else if (nodeClass===".userSidePanel"){
        sidePanelHandler(nodeClass, targetClass);
    }
}

const menuToggle = (nodeClass, returnVar = true) => {
    if(returnVar){
        backgroundPanelHandler(nodeClass);
        document.querySelector(nodeClass).classList.toggle("hiddenSection");
        document.querySelector(nodeClass).classList.toggle("activeSection");
    }
}

// background panel handler
const backgroundPanelHandler = (nodeClass, fromMenu = true) => {
    const bgPanel = document.querySelector(".backGroundPanel");

    if(nodeClass!==".userSidePanel"){
        fromMenu ? bgPanel.classList.toggle("activeSection") : (bgPanel.classList.contains("activeSection") ? bgPanel.classList.toggle("activeSection") : "");
        
        bgPanel.classList.toggle("hiddenSection");
    }
}

const closeBtnClicked = (nodeClass,userEdit,initialize=false) => {
    if(nodeClass === ".loginRegisterMenu"){
        if(document.querySelector(nodeClass).classList.contains("registerRN") || initialize){
            document.querySelector("section .emailContainer").classList.toggle("hiddenSection");
            document.querySelector("section .emailContainer input").disabled = true;
            initialize ? "" : document.querySelector(nodeClass).classList.toggle("registerRN");
        }
        document.querySelector(".loginRegisterMenu > p > .loginregisterFuncBtn").disabled = true;
        document.querySelectorAll(".loginRegisterMenu p input").forEach(inp=>inp.disabled = true);
    }else if(nodeClass === ".noteMenu"){
        if(userEdit){
            const addBtn = document.querySelector(".editBtn");
            addBtn.classList.toggle("editBtn");
            addBtn.classList.toggle("addBtn");
            addBtn.textContent = "Add Note";
            document.querySelector(".noteMenu").classList.toggle("userEdit");
        }else{
            const saveLocallyCon = document.querySelector(".extraInput .saveLocallyContainer");

            if(!saveLocallyCon.childNodes[3].disabled){
                saveLocallyCon.childNodes[3].disabled = true;
                saveLocallyCon.childNodes[3].checked = false;
                saveLocalChk = false;
            }
        }
        chkInput(document.querySelector(".extraInput.fd > .fd > .addBtn"));
        activeNote(false,false);
    }else if(nodeClass===".userSettings"){
        const sidePanelControl = document.querySelector(`${nodeClass} .sidePanelControl`);

        if(document.querySelector(nodeClass).classList.contains("asideOpen")){
            menuClicked(".userSidePanel");
        }

        userEditEmail = userNickName = _userNickName = userMobile = _userMobile = null;

        [sidePanelControl.childNodes[1], sidePanelControl.childNodes[3], sidePanelControl.childNodes[5]].forEach((item, i)=>{
            if(i!==2){
                item.classList.remove("userSidePanelBtn");
                item.childNodes[1].removeEventListener("click",clicked);
                item.childNodes[1].disabled=true;
                item.childNodes[1].textContent = "Add";
            }else{
                item.childNodes[1].textContent = "Nada";
            }
        })

        saveProfileBtnChk(true);
    }

    clearInputs(nodeClass);

    if(initialize){
        document.querySelector(nodeClass).classList.toggle("hiddenSection");
    }else{
        document.querySelector(nodeClass).classList.toggle("hiddenSection");
        document.querySelector(nodeClass).classList.toggle("activeSection");
    }

    backgroundPanelHandler(nodeClass, false);
}

const loginRegisterMenuPanelHandler = (nodeClass, registerClass)=>{
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

    menuToggle(nodeClass);
}

const noteMenuPanelHandler = nodeClass => {
    const delBtn = document.querySelector(".delBtn");
    const locallySaveCheck = document.querySelector(".extraInput .saveLocallyContainer");
    const addBtn = document.querySelector(".addBtn");

    if(!currentOpenID){
        delBtn.classList.add("hiddenSection");
        delBtn.disabled = true;
        activeNote(false, true);
        if(currentUser){
            if(locallySaveCheck.classList.contains("hiddenSection")){
                locallySaveCheck.classList.remove("hiddenSection");
            }
            if(locallySaveCheck.childNodes[3].classList.contains("hiddenSection")){
                locallySaveCheck.childNodes[1].innerText = "Save Locally: ";
                locallySaveCheck.childNodes[3].classList.remove("hiddenSection");
            }
            
            locallySaveCheck.childNodes[3].disabled ? locallySaveCheck.childNodes[3].disabled = false : "";
        }else{
            if(!locallySaveCheck.classList.contains("hiddenSection")){
                locallySaveCheck.classList.add("hiddenSection");
                locallySaveCheck.childNodes[3].disabled ? "" : locallySaveCheck.childNodes[3].disabled = true;
            }
        }
        menuToggle(nodeClass);
    }else{
        let id = currentOpenID;

        new Promise((resolve, reject) => {
            if(id.indexOf("note")===0){
                id = Number(id.replace("note",""));
                _DATABASE.forEach(item => {
                    if(currentUser===item.user){
                        if(id === item.id){
                            resolve(item);
                        }
                    }
                })
            }else{
                id = Number(id.replace("localNote",""));
                indexedDBGetData(_INDEXEDSTORENAME[0] ,id).then(data => {
                    if(data){
                        resolve(data.target.result);
                    }else{
                        reject(false);
                    }
                })
            }
        }).then(noteData => {
            if(locallySaveCheck.classList.contains("hiddenSection")){
                locallySaveCheck.classList.remove("hiddenSection");
            }
    
            if(!locallySaveCheck.childNodes[3].classList.contains("hiddenSection")){
                locallySaveCheck.childNodes[3].classList.add("hiddenSection");
                locallySaveCheck.childNodes[3].disabled ? "" : locallySaveCheck.childNodes[3].disabled = true;
            }
    
            addBtn.classList.toggle("addBtn");
            addBtn.classList.toggle("editBtn");
            addBtn.textContent = "Edit";

            title = titleInput = noteData.title;
            body = bodyInput = noteData.body;
            editable = noteData.editable;
            date = `created: ${noteData.date.month+1}/${noteData.date.day}/${noteData.date.year}`;
            if(noteData.lastUpdated){
            date+=` edited: ${noteData.lastUpdated.month+1}/${noteData.lastUpdated.day}/${noteData.lastUpdated.year}`;
            }
    
            locallySaveCheck.childNodes[1].innerText = date;
            document.querySelector(`${nodeClass} input`).value = prevTitleInput = title;
            document.querySelector(`${nodeClass} textarea`).value = prevBodyInput = body;
    
            if(!editable){
                document.querySelector(`${nodeClass} .extraInput .checkEditContainer input`).checked = false;
                activeNote();
            }else{
                document.querySelector(`${nodeClass} .extraInput .checkEditContainer input`).checked = true;
                activeNote(false, true);
            }
    
            delBtn.disabled=false;
            delBtn.classList.remove("hiddenSection");
            document.querySelector(nodeClass).classList.toggle("userEdit");

            menuToggle(nodeClass);
        });
        
    }
}

const userSettingsPanelHandler = nodeClass => {
    const sidePanelControl = document.querySelector(".sidePanelControl");
    const userObj = searchUserDBASE('username',currentUser,'nickname','pfp');
    const emailNumObj = searchUserDBASE('username', currentUser, 'email', 'mobile');

    if(userObj['pfp'] === "default"){
        pfpChange(_DEFAULTPFP);
        pfpEditCheck(false);
    }else{
        pfpChange(userObj['pfp']);
        pfpEditCheck(true);
    }

    [sidePanelControl.childNodes[1], sidePanelControl.childNodes[3], sidePanelControl.childNodes[5]].forEach((item,i)=>{
        if(i!==2){
            item.classList.add("userSidePanelBtn");
            item.childNodes[1].addEventListener("click",clicked);
            item.childNodes[1].disabled=false;
            i === 0 ? 
            (userObj.nickname ? item.childNodes[1].textContent = userNickName = _userNickName = userObj.nickname : "") : 
            (emailNumObj.mobile ? item.childNodes[1].textContent = userMobile = _userMobile = emailNumObj.mobile : "" );
        }else{
            item.childNodes[1].textContent = userEditEmail = emailNumObj.email;
        }
        
    })
    menuToggle(nodeClass);
}

const sidePanelHandler = (nodeClass, targetClass = null) => {
    let returnVar = true;
    const sidePanelControl = document.querySelector(".userSettings > .sidePanelControl");
    const userSideInsertBox = document.querySelector(".userSidePanel > p:nth-child(1)");
    const userSidePanelBtn = document.querySelector(".userSidePanel > .fd > .sidePanelBtn");
    const userSettings = document.querySelector("section.userSettings");

    if(!targetClass){
        targetClass = userSideInsertBox.childNodes[3].attributes.data_open.value + "Btn";
    }

    if(userSettings.classList.contains("asideOpen") && !userSideInsertBox.parentNode.classList.contains("hiddenSection") && targetClass.replace("Btn","")===userSideInsertBox.childNodes[3].attributes.data_open.value){
        sidePanelInputReset(userSideInsertBox, sidePanelControl, userSidePanelBtn);
    }else{
        returnVar = sidePanelInputReset(userSideInsertBox, sidePanelControl);
        const sidePanelInp = document.querySelector(".userSidePanel > p > #sidePanelInp");

        if(targetClass==="nickNameBtn"){
            userSideInsertBox.childNodes[1].innerText = "New Nickname:";
            userSideInsertBox.childNodes[3].setAttribute("data_open", "nickName");
            sidePanelControl.childNodes[1].childNodes[1].textContent = "Cancel";
            userNickName ? userSideInsertBox.childNodes[3].value = sideInput = userNickName : "";
        }else{
            userSideInsertBox.childNodes[1].innerText = "Mobile Number:";
            userSideInsertBox.childNodes[3].setAttribute("data_open", "mobile");
            sidePanelControl.childNodes[3].childNodes[1].textContent = "Cancel";
            userMobile ? userSideInsertBox.childNodes[3].value = sideInput = userMobile : "";
        }

        sideInput ? userSidePanelBtn.textContent = "Edit" : (returnVar ? "" : userSidePanelBtn.textContent = "Add");
        
        setTimeout(() => {
            sidePanelInp.disabled = false;
            sidePanelInp.focus();
        }, 60);
    }

    if(returnVar){
        document.querySelector("section.userSettings").classList.toggle("asideOpen");
    }

    menuToggle(nodeClass,returnVar);
}

const sidePanelInputReset = (userSideNode, sidePanelNode, userSidePanelBtn=false) => {
    let returnVar = true;
    const sidePanelInp = document.querySelector(".userSidePanel > p > #sidePanelInp");
    const sidePanelBtn = document.querySelector(".userSidePanel > p > .sidePanelBtn");

    if(userSideNode.childNodes[3].attributes.data_open){
        if(userSideNode.childNodes[3].attributes.data_open.value === "nickName"){
            userNickName ? sidePanelNode.childNodes[1].childNodes[1].textContent = userNickName : sidePanelNode.childNodes[1].childNodes[1].textContent = "Add";
        }else{
            userMobile ? sidePanelNode.childNodes[3].childNodes[1].textContent = userMobile : sidePanelNode.childNodes[3].childNodes[1].textContent = "Add";
        }

        if(userSidePanelBtn){
            userSidePanelBtn.textContent === "Add" ? "" : userSidePanelBtn.textContent = "Add";
            userSideNode.childNodes[1].innerText = "Insert Value:";
            userSideNode.childNodes[3].removeAttribute("data_open");
        }else{
            //returnVar becomes false if sidePanel is already open
            returnVar = userSidePanelBtn;
        }

        if(userSideNode.childNodes[3].value !== ""){
            userSideNode.childNodes[3].value = "";
            sideInput = "";
        }
        
        setTimeout(() => {
            sidePanelInp.blur();
            sidePanelInp.disabled = sidePanelBtn.disabled = true;
        }, 60);
    }
    return returnVar;
}

const clearInputs = whichNode => {
    if(whichNode===".loginRegisterMenu"){
        document.querySelectorAll(`${whichNode} p input`).forEach(input=>input.value = "");
    }else if(whichNode===".userSettings"){
        pfpRemove(null);
        // nickLabelChange(null);
    }else{
        document.querySelector(`${whichNode} input`).value="";
        document.querySelector(`${whichNode} textarea`).value="";
        document.querySelector(`${whichNode} .extraInput .checkEditContainer input`).checked = false;
        titleInput = "";
        bodyInput = "";
        editable = false;
    }
}

const activeNote = (fromEdit=false, isActive = false) => {
    
    const noteMenu = document.querySelector(".noteMenu");

    document.querySelector(".noteMenu input").disabled = !isActive;
    document.querySelector(".noteMenu textarea").disabled = !isActive;
    // document.querySelector(".noteMenu .extraInput p button:first-child").disabled = !isActive;

    if(fromEdit){
        if(isActive && noteMenu.classList.contains("nonEditable")){
            noteMenu.classList.toggle("nonEditable");
        }else if(!isActive && !noteMenu.classList.contains("nonEditable")){
            noteMenu.classList.toggle("nonEditable");
        }

        let id = currentOpenID;

        if(id.indexOf("note")===0){
            id = Number(currentOpenID.replace("note",""));
            _DATABASE.forEach(item => {
                if(item.user===currentUser){
                    if(id===item.id){
                        item.editable = !item.editable;
                    }
                }
            })
        }else{
            id = Number(currentOpenID.replace("localNote",""));
            local_DATABASE.forEach(item=>{
                if(id===item.id){
                    item.editable = !item.editable;
                }
            })
        }
        
    }else{
        if(noteMenu.classList.contains("nonEditable")){
            noteMenu.classList.toggle("nonEditable");
        }
    }
}

const activePanel = () => {
    const navNode = document.querySelector("nav .userPanel");

    // document.querySelector("section.userSettings").classList.contains("hiddenSection") ? "" : closeBtnClicked(".userSettings");
    checkingOpenedFrames();

    if(navNode.classList.contains("panelActive")){
        navNode.classList.toggle("panelActive");
        navNode.classList.toggle("panelInactive");
        userPanelBtn(true, [navNode.childNodes[1].childNodes[0], navNode.childNodes[3].childNodes[0]]);
        
    }else{
        if(navNode.classList.contains("panelInactive")){
            navNode.classList.toggle("panelActive");
            setTimeout(()=>{
                userPanelBtn(false, [navNode.childNodes[1].childNodes[0], navNode.childNodes[3].childNodes[0]]);
            }, 200)
        }else{
            userPanelBtn(true, [navNode.childNodes[1].childNodes[0], navNode.childNodes[3].childNodes[0]]);
        }
        

        navNode.classList.toggle("panelInactive");
    }
    
}

const userPanelBtn = (varBool, [btn1, btn2]) => {
    btn1.disabled = varBool;
    btn2.disabled = varBool;
}

const checkLoggedAccount = () => {
    let returnVar = false;
    if(localStorage.getItem(_USERLOGGEDKEY)){
        searchUserDBASE('username', localStorage.getItem(_USERLOGGEDKEY)) ? currentUser = localStorage.getItem(_USERLOGGEDKEY) : localStorage.removeItem(_USERLOGGEDKEY);
    
        if(currentUser){
            returnVar = true;
            userLogInOut();
        }else{
            localStorage.removeItem(_USERLOGGEDKEY);
        }
    }
    
    return returnVar;
}

const accountLogged = isLogged => {
    isLogged ? localStorage.setItem(_USERLOGGEDKEY, currentUser) : localStorage.removeItem(_USERLOGGEDKEY);
}

const saveProfile = () => {
    //checks if currentFile was changed
    //currentFile by default is null
    //currentFile having a value other than null means it was changed
    if(currentFile){
        currentFile === "default" ? pfpNavChange(_DEFAULTPFP) : pfpNavChange(currentFile);
        updateUserDBASE(currentUser,'pfp',currentFile);
    }
    currentFile=null;
    
    if(userNickName){
        panelBtnChange(userNickName);
    }else{
        panelBtnChange(currentUser);
    }

    _CHANGESETPROP.forEach(item => changedSettingsChk[item] ? changedSettingsChk[item] = false : "");
    
    updateUserDBASE(currentUser,'nickname',userNickName);
    updateUserDBASE(currentUser,'mobile',userMobile);

    closeBtnClicked(".userSettings");
}



const saveProfileBtnChk = (chkDisable, currentChange=null) =>{
    const saveProfileBtn = document.querySelector(".userSettings > .saveProfileBtnCon > .saveProfileBtn");
    let chkToDisable=true;

    if(saveProfileBtn.disabled !== chkDisable){
        if(currentChange){
            _CHANGESETPROP.forEach(item=>{
                if(item!==currentChange){
                    if(changedSettingsChk[item]===true){
                        if(chkDisable){
                            chkToDisable=false;
                        }
                    }
                }else{
                    changedSettingsChk[item] = !chkDisable;
                }
                })
        }
        if(chkToDisable){
            saveProfileBtn.disabled = chkDisable;
        }
    }
}

const userMobileNickHandler = () => {
    const sidePanelControl = document.querySelector("aside.userSidePanel > p:nth-child(1)");
    let chkChange=true, btnChk;

    const open_DATA = sidePanelControl.childNodes[3].attributes.data_open.value;
    let valueReturn, whichChange;

    open_DATA === "nickName" ? valueReturn = userNickName : valueReturn = userMobile;

    if(sideInput){
        if((open_DATA === "nickName" && sideInput !== _userNickName) ||
        (open_DATA === "mobile" && sideInput !== _userMobile)){
            valueReturn = sideInput;
            btnChk = false;
        }else{
            if(open_DATA === "nickName" && userNickName !== _userNickName){
                valueReturn = _userNickName;
            }else if(open_DATA === "mobile" && userMobile !== _userMobile){
                valueReturn = _userMobile;
            }
            btnChk = true;
        }
    }else{
        if((open_DATA === "nickName" && userNickName) || (open_DATA === "mobile" && userMobile)){
            let returnVar = false;
            valueReturn = null;

            if(open_DATA === "nickName"){
                !_userNickName && userNickName ? returnVar = true : "";
            }else{
                !_userMobile && userMobile ? returnVar = true : "";
            }
            
            btnChk = returnVar;
        }else{
            alert("empty");
            chkChange=false;
        }
    }

    open_DATA === "nickName" ? userNickName = valueReturn : userMobile = valueReturn;
    open_DATA === "nickName" ? whichChange = "userNickChk" : whichChange = "userMobileChk"

    chkChange ? saveProfileBtnChk(btnChk, whichChange) : "";
    menuClicked(".userSidePanel");
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
    let ans;
    e ?  ans = confirm("are you sure?") : true;

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
    document.querySelector(".userSettings .pfpContainer .pfp").src=newPfP;
    let chkToDisable;
    user_DATABASE.forEach(user=>{
        if(user.username===currentUser){
            if(user.pfp!==newPfP){
                if(user.pfp==="default" && newPfP===_DEFAULTPFP){
                    chkToDisable = true;
                }else{
                    chkToDisable = false;
                }
            }else{
                chkToDisable = true;
            }
        }
    })

    
    saveProfileBtnChk(chkToDisable, 'userPfpChk');
}

const pfpNavChange = newPfP => {
    document.querySelector(".loggedInUL .pfpContainer .pfp").src=newPfP;
}

const panelBtnChange = user => {
    document.querySelector(".loginRegisterMenuBtn:nth-child(2) > button").textContent = user;
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

    return returnVar;
}

const chkInput = (addBtn, fValue=null, sValue=null) => {
    if(fValue || sValue){
            addBtn.disabled = false;
    }else{
            addBtn.disabled = true;
    }
}

const chkNoteInput = (value, value2, value3 = null, whichNodeFlow = null) => {
    const loginregisterFuncBtn = document.querySelector(".loginRegisterMenu p .loginregisterFuncBtn");

    if(whichNodeFlow){
        value && value2 && value3 ? loginregisterFuncBtn.disabled = false : loginregisterFuncBtn.disabled = true;
    }else{
        value && value2 ? loginregisterFuncBtn.disabled = false : loginregisterFuncBtn.disabled = true;
    }
}

const chkInputNote = (val, whereFrom) => {
    let s_val;
    const editBtn = document.querySelector(".extraInput > .fd > .editBtn");
    whereFrom === "title" ? s_val = bodyInput : s_val = titleInput;

    if((whereFrom === "title" && (val !== prevTitleInput || s_val !== prevBodyInput)) || (whereFrom === "body" && (val !== prevBodyInput || s_val !== prevTitleInput))){
        editBtn.disabled = false;
    }else{
        editBtn.disabled = true;
    }
}

const checkIndexedDB = () => {
    let returnVar = 'indexedDB' in window;

    return returnVar;
}

const indexedDBInit = dbase => {
    switch (dbase.version) {
        case 1:
            !dbase.objectStoreNames.contains(_INDEXEDSTORENAME[0]) ? dbase.createObjectStore(_INDEXEDSTORENAME[0], {keyPath: 'id', autoIncrement: true}) : "";
            !dbase.objectStoreNames.contains(_INDEXEDSTORENAME[1]) ? dbase.createObjectStore(_INDEXEDSTORENAME[1], {keyPath: 'image_id', autoIncrement: true}) : "";
    }
}

const indexedDBGetDB = () => {
    return new Promise((resolve, reject) => {
        if(checkIndexedDB()){
            let dbReq = indexedDB.open(_INDEXEDDBNAME, 1);

            dbReq.onupgradeneeded = e => {
                indexedDBInit(e.target.result);
            }
    
            dbReq.onsuccess = e => {
                console.log("database opened successfully");
                let dbase = e.target.result;
                resolve(dbase);
            }
    
            dbReq.onerror = e => {
                console.log("database error opening", e.target.result);
                reject(null);
            }
        }else{
            console.error('indexedDB Not supported!');
            reject(false);
        }
})}

const indexedDBTerminal = (oSName ,item, transactionType) => {
    return new Promise((resolve, reject) => {
        indexedDBGetDB().then(dbase => {
            if(dbase){
                let tx = dbase.transaction(oSName, 'readwrite');
                let store = tx.objectStore(oSName);
    
                tx.oncomplete = () => {
                    console.log("hey");
                    resolve(true);
                }
    
                tx.onerror = () => {
                    
                    console.log("nop");
                    reject(false);
                }
    
                switch(transactionType) {
                    case 'add':
                        store.add(item);
                        break;
                    case 'edit':
                        store.put(item);
                        break;
                    case 'del':
                        store.delete(item);
                        break;
                }
            }else{
                reject(false);
            }
        }).catch(()=>{
            reject(false);
        });
    })
}

const indexedDBGetAllNoteOS = () => {
    return new Promise((resolve, reject) => {
        indexedDBGetDB().then(dbase=>{
            let x = 0;
            let req = dbase.transaction(_INDEXEDSTORENAME[0], 'readonly').objectStore(_INDEXEDSTORENAME[0]).openCursor();

            req.onsuccess = e => {
                let cursor = e.target.result;
                if(cursor){
                    createNote(cursor.value.title, cursor.value.body, cursor.value.id, cursor.value.user);
                    x++;
                    cursor.continue();
                }else{
                    if(x){
                        resolve('done');
                    }else{
                        resolve('none');
                    }
                }
            }

            req.onerror = e => {
                reject(false);
            }
        }).catch(()=>{
            reject(false);
        });
    })
}

const indexedDBAlternateGetAll = () => {
    indexedDBGetDB().then(dbase => {
        let req = dbase.transaction(_INDEXEDSTORENAME[0], 'readonly').objectStore(_INDEXEDSTORENAME[0]).getAll();

        req.onsuccess = e => {
            console.log(e.target.result, "ll");
        }
    }).catch(()=>{
        reject(false);
    });
}

const indexedDBGetData = (oSName, id) => {
    return new Promise((resolve, reject) => {
        indexedDBGetDB().then(dbase => {
            if(dbase){
                let req = dbase.transaction(oSName, "readonly").objectStore(oSName).get(id);

                req.onsuccess = data => {
                    resolve(data);
                }

                req.onerror = e => {
                    reject(false);
                }
            }
        }).catch(()=>{
            reject(false);
        });
    })
}

const indexedDBDel = () => {
    // delete database

    var request = indexedDB.deleteDatabase(_INDEXEDDBNAME);

    request.onsuccess = e => {console.log("there ya go")};
}

window.onload = () =>{
    const sections = document.querySelectorAll("body section");
    const selectOrder = document.querySelector(".mainArticle .orderListCon select");
    const sectionCloseBtns = document.querySelectorAll("section .closeBtn");
    const logOutBtn = document.querySelector(".userPanel li .logOutBtn");
    //loginRegister
    const loginRegisterMenu = document.querySelector(".loginRegisterMenu");
    const loginMenuBtn = document.querySelector("ul .loginRegisterMenuBtn .loginBtn");
    const registerMenuBtn = document.querySelector("ul .loginRegisterMenuBtn .registerBtn");
    const loginregisterFuncBtn = document.querySelector(".loginRegisterMenu p .loginregisterFuncBtn");
    const usernameInput = document.querySelector("#usernameInput");
    const passwordInput = document.querySelector("#passwordInput");
    const emailInput = document.querySelector("#emailInput");
    //note
    const noteMenu = document.querySelector(".noteMenu");

    const addBtn = document.querySelector(".addBtn");
    const delBtn = document.querySelector(".delBtn");
    const titleBox = document.querySelector(".noteMenu input");
    const bodyBox = document.querySelector(".noteMenu textarea");
    const chckBox = document.querySelector(".noteMenu .extraInput .checkEditContainer input");
    const saveLocallyCheck = document.querySelector(".noteMenu .extraInput .saveLocallyContainer input");

    //userSettings
    const userSettings = document.querySelector(".userSettings");
    const userSettingsBtn = document.querySelector(".userSettingsBtn");
    const userpfpInput = document.querySelector("#userpfpInput");
    const saveProfileBtn = document.querySelector(".saveProfileBtn");
    const sidePanelInp = document.querySelector("aside.userSidePanel > p:nth-Child(1) > #sidePanelInp");
    const sidePanelBtn = document.querySelector("aside.userSidePanel > p:nth-Child(2) > .sidePanelBtn");
    //otherVar
    let init = true;

    sections.forEach(section=>{
        closeBtnClicked("."+section.classList[0],false,init);   
    });
    
    activePanel();

    const insertInput = e => {
        if(e.target.classList.contains("titleBox")){
            currentOpenID ? chkInputNote(e.target.value, "title") : chkInput(addBtn, e.target.value, bodyInput);
            titleInput = e.target.value;
        }else if(e.target.classList.contains("bodyBox")){
            currentOpenID ? chkInputNote(e.target.value, "body") : chkInput(addBtn, e.target.value, titleInput);
            bodyInput = e.target.value;
        }else if(e.target.id === "usernameInput" || e.target.id === "passwordInput"){
            e.target.id === "usernameInput" ? userName = e.target.value : userPass = e.target.value;

            document.querySelector(".loginRegisterMenu").classList.contains("registerRN") ? chkNoteInput(userName, userPass, userEmail, "register") : chkNoteInput(userName, userPass);
        }else if(e.target.id === "emailInput"){
            userEmail = e.target.value;
            chkNoteInput(userName, userPass, userEmail, "register");
        }else if(e.target.id === "sidePanelInp"){
            sideInput = e.target.value;
            let printValue;

            if((sidePanelInp.attributes.data_open.value === "nickName" && userNickName) || 
            (sidePanelInp.attributes.data_open.value === "mobile" && userMobile)){
                sideInput ? printValue = "Edit" : printValue = "Clear";
                if(sidePanelInp.attributes.data_open.value === "nickName"){
                    userNickName === sideInput ? sidePanelBtn.disabled = true : sidePanelBtn.disabled = false;
                }else{
                    userMobile === sideInput ? sidePanelBtn.disabled = true : sidePanelBtn.disabled = false;
                }
            }else{
                sideInput ? sidePanelBtn.disabled = false : sidePanelBtn.disabled = true;
            }

            printValue ? sidePanelBtn.textContent = printValue : "";
        }
    }
    
    const checkingBox = e => {
        editable = e.target.checked;
        if(e.target.parentNode.parentNode.parentNode.classList.contains("userEdit")){
            activeNote(true,editable);
            if(currentOpenID){
                if(titleInput!==prevTitleInput){
                    document.querySelector(".noteMenu > input.titleBox").value = titleInput = prevTitleInput;
                }
                if(bodyInput!==prevBodyInput){
                    document.querySelector(".noteMenu > textarea.bodyBox").value = bodyInput = prevBodyInput;
                }
                document.querySelector(".extraInput > .fd > .editBtn").disabled = true;
            }
        }
    }

    const chkLocallySave = e => {
        saveLocalChk = e.target.checked;
    }

    const focusedTT = e => {
        e.target.parentNode.classList.toggle("focusTT");
    }

    const itemScan = (nodeList, targetNode) => {
        let returnVar = false;
        nodeList.forEach(item=>{
            if(!returnVar){
                if(item !== targetNode){
                    if(item.childNodes){
                        returnVar = itemScan(item.childNodes, targetNode);
                    }
                }else{
                    returnVar = true;
            }}
        })
        
        return returnVar;
    }

    [...sectionCloseBtns, logOutBtn, userSettingsBtn, loginMenuBtn, registerMenuBtn, loginregisterFuncBtn, addBtn, delBtn, , sidePanelBtn, saveProfileBtn].forEach(item=>item.addEventListener("click",clicked));
    [usernameInput, emailInput, passwordInput, titleBox, bodyBox, sidePanelInp].forEach(item=>item.addEventListener("input",insertInput));

    window.addEventListener("keydown", e => {
        if(e.key==="Enter"){
            if(e.target === usernameInput || e.target === emailInput || e.target === passwordInput){
                loginregisterFuncBtn.click();
            }else if(e.target === sidePanelInp){
                sidePanelBtn.click();
            }else if(e.target === titleBox || e.target === bodyBox){
                addBtn.click();
            }
        }
        
    });

    window.addEventListener("click",e => {
        if(!clickedChk){
            let chkWhichClicked = true;
            
            [noteMenu, loginRegisterMenu, userSettings].forEach(node => {
                if(!node.classList.contains("hiddenSection")){
                    e.target === document.querySelector(".backGroundPanel") ? chkWhichClicked = false : "";
                }
            })

            chkWhichClicked ? "" : checkingOpenedFrames();
        }
    })

    //loginregister
    usernameInput.addEventListener("focus",focusedTT);
    passwordInput.addEventListener("focus",focusedTT);
    usernameInput.addEventListener("blur",focusedTT);
    passwordInput.addEventListener("blur",focusedTT);
    //note
    chckBox.addEventListener("change", checkingBox);
    saveLocallyCheck.addEventListener("change", chkLocallySave);
    //userSettings
    userpfpInput.addEventListener("change", pfpUpload);

    selectOrder.selectedIndex = 0;

    selectOrder.addEventListener("click", e=>{
        checkingOpenedFrames();
    })

    selectOrder.addEventListener("change",({target})=>{
        orderList(target.value);
    })

    indexedDBGetDB();

    if(!checkLoggedAccount()){
        nodeLoad();
    }
}