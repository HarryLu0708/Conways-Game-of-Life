import './App.css';
import { useCallback, useRef, useState } from 'react';
import { produce } from 'immer';

let numRows = 50;
let numCols = 50;

const operations = [
  [0,1],
  [0,-1],
  [1,-1],
  [-1,1],
  [1,1],
  [-1,-1],
  [1,0],
  [-1,0]
];

function SelectionBar(){
  return (
    <select id='colorSel'>
      <option value="yellow">Yellow</option>
      <option value="blue">Blue</option>
    </select>
  );
}

function App() {
  const [grid, setGrid] = useState(()=>{
    const rows = [];
    for(let i=0; i<numRows; i++){
      rows.push(Array.from(Array(numCols),()=>0));
    }
    return rows;
  });

  const [running, setRunning] = useState(false);
  const runningRef = useRef(running);
  runningRef.current = running;

  const runSimulation = useCallback(()=>{
    if(!runningRef.current){
      return;
    }
    setGrid(g=>{
      return produce(g,gridCopy=>{
        for(let i=0;i<numRows;i++){
          for(let j=0;j<numCols;j++){
            let neighbors = 0;
            operations.forEach(([x,y])=>{
              const newI = i+x;
              const newJ = j+y;
              if(newI>=0&&newI<numRows&&newJ>=0&&newJ<numCols){
                neighbors += g[newI][newJ];
              }
            })
            if(neighbors<2||neighbors>3){
              gridCopy[i][j] = 0;
            }else if(g[i][j]===0&&neighbors===3){
              gridCopy[i][j] = 1;
            }
          }
        }
      });
    });
    setTimeout(runSimulation,1000);
  },[]);


  return (
    <>
    <button 
    onClick={()=>{
      setRunning(!running);
      if(!running){
      runningRef.current=true;
      runSimulation();
    }}}
    >{running?"stop":"start"}</button>
    <button
    onClick={()=>{setGrid(g=>{
        return produce(g,gridCopy=>{
        for(let i=0;i<numRows;i++){
          for(let j=0;j<numCols;j++){
            gridCopy[i][j] = 0;
          }
        }
      }
    )
  })}}>Restart</button>
  <SelectionBar />
    <div style={{
      display:"grid",
      gridTemplateColumns: `repeat(${numCols}, 20px)`
    }}
    >
      {grid.map((rows, i)=>
        rows.map((col, k)=>(
          <div
          key={`${i}-${k}`}
          onClick={()=>{
            const newGrid = produce(grid, gridCopy => {
              gridCopy[i][k] = gridCopy[i][k]?0:1;
            });
            setGrid(newGrid);
          }}
          style={{
            width:20,
            height: 20,
            backgroundColor: grid[i][k]?"yellow":"black",
            border:"solid 1px white"
          }}
          />
        ))
      )}
    </div>
    </>
    );
}

export default App;
