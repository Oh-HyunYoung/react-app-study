import './App.css';
import {useState} from 'react';

// Create Method
function Create(props){
  return <article>
    <h2>Create</h2>
    <form onSubmit={event=>{
      event.preventDefault();
      const title = event.target.title.value;
      const body = event.target.body.value;
      props.onCreate(title,body);
    }}>
      <p><input type="text" name="title" placeholder="title"/></p>
      <p><textarea name="body" placeholder='body'></textarea></p>
      <p><input type="submit" value="Create"/></p>
    </form>
  </article>
}

// Header "WEB"
function Header(props) {
    return <header>
    <h1><a href="/" onClick={(event)=>{
        event.preventDefault();
        props.onChangeMode();
    }}>{props.title}</a></h1>
  </header>
}

// Navigation 클릭시 이동(주소 변경)
function Nav(props){
  const lis = []
  for(let i=0; i<props.topics.length; i++){
    let t = props.topics[i];
    lis.push(<li key={t.id}>
      <a id = {t.id} href={'/read/'+t.id} onClick={event=>{
        event.preventDefault();
        props.onChangeMode(Number(event.target.id));
      }}>{t.title}</a>
      </li>)
  }
  return <nav>
    <ol>
      {lis}
    </ol>
  </nav>
}

// 클릭시 제목곽 내용 출력
function Article(props){
  return <article>
  <h2>{props.title}</h2>
    {props.body}
  </article>
}

// web 외의 나머지 누르면 update 나옴
// 새로운 글 추가
// 기존의 글 남아있어야함 value={props.title} -- 이용
// props를 state 로 바꿔야함
function Update(props){
  const [title, setTitle] = useState(props.title);
  const [body, setBody] = useState(props.body);
  return <article>
    <h2>Create</h2>
    <form onSubmit={event=>{
      event.preventDefault();
      const title = event.target.title.value;
      const body = event.target.body.value;
      props.onUpdate(title,body);
    }}>
      <p><input type="text" name="title" placeholder="title" value={title} onChange={event=>{
        setTitle(event.target.value);
      }}/></p> 
      <p><textarea name="body" placeholder='body' value={body} onChange={event=>{
        setBody(event.target.value);
      }}/></p>
      <p><input type="submit" value="Update"/></p>
    </form>
  </article>
}

function App() {
  const [mode, setMode] = useState('WELCOME');
  const [id, setId] = useState(null);
  const [nextId, setNextId] = useState(4);
  const [topics, setTopics] = useState([
    {id:1, title:'html', body:'html is..'},
    {id:2, title:'css', body:'css is..'},
    {id:3, title:'javascript', body:'javascript is..'}
  ]);

  let content = null;
  let contextControl = null;

  if(mode === 'WELCOME'){
    content =  <Article title="Welcome" body="Hello, WEB"/>
  } else if(mode === 'READ'){
    let title, body = null;
    for(let i=0; i<topics.length; i++){
      if(topics[i].id === id){
        title = topics[i].title;
        body = topics[i].body;
      }
    }

    content =  <Article title={title} body={body}/>
    contextControl = <li><a href={'/update/'+ id} onClick={event=>{
      event.preventDefault();
      setMode('UPDATE');
    }}>Update</a></li>
  } else if(mode === "CREATE"){
    content = <Create onCreate={(_title, _body)=>{
      const newTopic = {id:nextId, title:_title, body:_body}
      const newTopics = [...topics]
      newTopics.push(newTopic);
      setTopics(newTopics);
      setMode("READ");
      setId(nextId+1);
    }}/>
  } else if(mode === "UPDATE"){
    let title, body = null;
    for(let i=0; i<topics.length; i++){
      if(topics[i].id === id){
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = <Update title={title} body={body} onUpdate={(title, body)=>{
      // 수정된 topic 저장
      const newTopics = [...topics]
      const updatedTopic = {id:id, title:title, body:body}
      for(let i=0; i<newTopics.length; i++){
        if(newTopics[i].id === id){
          newTopics[i] = updatedTopic;
          break;
        }
      }
      setTopics(newTopics);
      setMode("READ");
    }}/>
  }

  return (
    <div>
      <Header title="WEB" onChangeMode={()=>{
        setMode('WELCOME'); // 값을 바꿀 때에는 setMode 사용
        }}/>
      <Nav topics={topics} onChangeMode={(_id)=>{
        setMode('READ'); // 값을 바꿀 때에는 setMode 사용
        setId(_id);
        }}/>
      {content}
      <ul>
        <li><a href="/create" onClick={event=>{
          event.preventDefault();
          setMode('CREATE');
        }}>Create</a></li>
        {contextControl}
      </ul>
    </div>
  );
}

export default App;
