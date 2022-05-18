import { useState } from 'react';

import Corpus from './Corpus/index.ts';
import testCorpus from './corpus.json';

import { Button, ButtonGroup, Container, TextField, Typography } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box } from '@mui/system';
import { teal } from '@mui/material/colors';

import './App.scss';

const darkTheme = createTheme({
	palette: {
		mode: 'dark',
		primary: teal,
		text: {
			primary: "#eee"
		}
	}
});

const corpus = new Corpus()
	.populate(testCorpus[0])
	.learn();

function App() {
	const [text, setText] = useState("");
	const [top3, setTop3] = useState([]);

	function inputChanged({ target: { value } }) {
		setText(value);
		update(value);
	}
	
	function update(value) {
		const p = corpus.predict(value);

		setTop3(p
			.slice(0, 3)
			.map(e => Object.keys(e)[0])
			.reduce((a, c) => {
				if (!a.includes(c)) a.push(c);
				return a;
			}, [])
		);
	}

	return (
		<ThemeProvider theme={ darkTheme }>
			<Container className='main-container' maxWidth='xs'>
				<Typography variant='h5' style={{
					color: "#eee",
					textAlign: "center",
					margin: "1rem",
					fontWeight: "bold",
					textTransform: "uppercase"
				}}>Sentence Completion</Typography>
				<Box style={{ margin: "0 1rem" }}>
					<TextField
						multiline
						fullWidth
						minRows={ 10 }
						maxRows={ 10 }
						onChange={ inputChanged }
						value={ text }
					/>
				</Box>
				<ButtonGroup variant='text' fullWidth>
					{ top3.map((s, i) => {
						function clicked() {
							const split = text.split(/\s+/).filter(e => e.length);
							split.push(s);
							const p = split.join(" ");
							setText(p);
							update(p);							
						}
						return <Button key={ i } onClick={ clicked }>{ s }</Button>;
					}) }
				</ButtonGroup>
			</Container>
		</ThemeProvider>
	);
}

export default App;
