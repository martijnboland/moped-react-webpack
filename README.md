# moped-react
Experimental Mopidy web client written with ReactJS. You'll need to have a working [Mopidy](https://www.mopidy.com/) server with some playlists to try it. 
Currently, it's only possible to play tracks from playlists. Other Moped functionality is not implemented.

## Development

A prerequisite for this project is a working Node.js environment. Then perform the following steps:

```bash
npm install -g gulp
```

```bash
npm install
```

```bash
npm run dev
```

## Production ready build

To make the app ready for deploy to production run:

```bash
npm run dist
```
