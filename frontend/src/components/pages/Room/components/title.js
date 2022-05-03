export const RoomTitle = (props={roomid: ""}) => {
    return (
        <>
            <p>roomid: <a href={"/room/join/"+props.roomid}>{props.roomid}</a></p>
        </>
    );
}

RoomTitle.defaultProps = {
    roomid: "",
};