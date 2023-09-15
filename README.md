# nbshare

jupyter notebook を表示するアプリ

## 使用技術
- python3.9
- node:19

## setup

- backend

```sh
rye sync
```

- frontend

```sh
cd frontend
yarn install
```

## how to

### 開発時

- backend

```sh
rye run uvicorn app:app --reload --port 9000
```

- frontend

```sh
yarn dev
```

### 本番時

- build frontend

```sh
yarn build
```

- run backend

```sh
rye run uvicorn app:app --reload --port 9000
```
