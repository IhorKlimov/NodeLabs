import * as React from 'react';
import {useEffect, useMemo, useRef, useState} from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import {Paper, styled} from "@mui/material";

const Item = styled(Paper)(({theme}) => ({
    ...theme.typography.body2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    width: '100%'
}));

export default function VirtualizedList() {
    const [list, setList] = useState([]);
    const [input, setInput] = useState('');
    const scrollRef = useRef(null);
    const myId = useMemo(() => {
        return guidGenerator();
    }, []);
    const webSocket = useMemo(() => {
        console.log("memo")
        return new WebSocket('ws://localhost:443/');
    }, []);

    webSocket.onmessage = (event) => {
        console.log("Message")
        const data = JSON.parse(event.data);
        console.log(list)
        const newList = [...list];
        newList.push(data);
        setList(newList);
        console.log(newList)
        console.log(list);
        setTimeout(() => {
            console.log(list);

        }, 3000);
    }

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({behaviour: "smooth"});
        }
    }, [list]);

    function renderRow(item, index) {
        const marginLeft = item.fromId === myId ? '200px' : '20px';
        const marginRight = item.fromId === myId ? '20px' : '200px';
        const justify = item.fromId === myId ? 'right' : 'left';
        const bgColor = item.fromId === myId ? 'cadetblue' : 'orange';

        return (
            <div key={index} style={
                {
                    marginLeft: marginLeft,
                    marginTop: '10px',
                    marginBottom: '10px',
                    marginRight: marginRight,
                    display: 'flex',
                    justifyContent: justify
                }}>
                <div style={
                    {
                        background: bgColor,
                        paddingTop: '10px',
                        paddingBottom: '10px',
                        color: 'white',
                        borderRadius: '100px',
                        paddingLeft: '10px',
                        paddingRight: '10px'
                    }
                }>{item.message}</div>
            </div>
        );
    }

    function sendMessage() {
        const data = {type: 'message', message: input, fromId: myId};
        webSocket.send(JSON.stringify(data));
        console.log(list)
        const newList = [...list];
        newList.push(data);
        setList(newList);
        console.log(list)
        setInput("");
    }

    return (
        <Item style={{margin: '0 auto', width: '500px'}}>
            <Box sx={{width: '100%', height: 500}}>
                <ul style={{height: '450px', overflow: 'auto', listStyle: 'none', padding: '0'}}>
                    {list.map((item, index) => (
                        renderRow(item, index)
                    ))}
                    <li ref={scrollRef} key={1231243124124124124}/>
                </ul>
            </Box>
            <Box
                sx={{
                    maxWidth: '100%',
                    display: 'flex',
                    padding: '10px'
                }}>
                <TextField
                    style={{width: '100%'}}
                    label="Enter a message"
                    value={input}
                    onChange={(event) => {
                        setInput(event.target.value);
                    }}
                    id="fullWidth"
                    onKeyDown={(e) => {
                        if (e.code === "Enter") {
                            sendMessage();
                        }
                    }
                    }/>
            </Box>
        </Item>
    );

    function guidGenerator() {
        const S4 = function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    }
}