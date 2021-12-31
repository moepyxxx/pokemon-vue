# 始める時

## 最初には

### イメージビルド
```bash
$ docker build -t node_pokeshot .
```

### 立ち上げ
```bash
$ docker run -it -p 0.0.0.0:3000:3000 -v $(pwd)/pokeshot:/usr/src/app node_pokeshot yarn dev
```

### シェル入る
```bash
$ docker run -it node_pokeshot sh
```

### インストール
```
$ docker run -it -p 0.0.0.0:3000:3000 -v $(pwd)/pokeshot:/usr/src/app node_pokeshot yarn install (package)
```