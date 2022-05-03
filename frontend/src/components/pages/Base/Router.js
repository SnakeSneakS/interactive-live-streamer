import React from "react"

import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

import CreateRoomPage from "components/pages/Room/Create/CreateRoomPage";
import JoinRoomPage from "components/pages/Room/Join/JoinRoomPage"
import HomePage from 'components/pages/Home/HomePage';
import NotFoundPage from 'components/pages/NotFound/NotFoundPage';

const MyRouter = (props) => {
    return (
        <div>
            <Router>
                <div>
                    {props.before}
                </div>
                <div className="m-3">
                    <Routes>
                        <Route path="/">
                            <Route index element={<HomePage />} />
                            <Route path="test" element={<div>aaa</div>} />
                            <Route path="room">
                                <Route index element={<div>Room</div>} />
                                <Route path="create" element={<CreateRoomPage />} />
                                <Route path="join" element={<JoinRoomPage />} >
                                    <Route path=":roomid" element={<JoinRoomPage />} /> 
                                </Route>
                            </Route>
                            <Route path="*" element={<NotFoundPage/>}></Route>
                        </Route>
                    </Routes>
                </div>
            </Router>
        </div>
    );
}


export default MyRouter;
