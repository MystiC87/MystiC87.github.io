# MystiC87.github.io

GitHub Pages로 배포하는 개인 포트폴리오입니다. 별도의 빌드 과정이나 프레임워크 없이 HTML, CSS, JavaScript만 사용합니다.

## 로컬에서 확인하기

`index.html`을 브라우저로 열거나 간단한 로컬 서버를 실행합니다.

```bash
python -m http.server 8000
```

브라우저에서 `http://localhost:8000`으로 접속합니다.

## 내용 수정하기

- `index.html`: 소개, 프로젝트, 연락처 등 실제 콘텐츠
- `styles.css`: 색상, 타이포그래피, 반응형 레이아웃
- `script.js`: 테마 전환, 스크롤 등장 효과, 연도 자동 표시
- `assets/favicon.svg`: 브라우저 탭 아이콘
- `assets/profile.webp`: 소개 영역의 4:5 프로필 사진(파일이 없으면 자리 표시자 표시)
- `assets/about-workspace.jpg`: 소개 영역 하단의 비식별 개발 데스크 이미지
- `.editorconfig`, `.gitattributes`: UTF-8 및 줄바꿈 형식 통일

배포 전 `index.html`의 프로젝트 예시와 `your-email@example.com`을 실제 정보로 교체하세요.

## GitHub Pages 배포

이 저장소는 사용자 사이트 저장소(`MystiC87.github.io`)이므로 `main` 브랜치의 루트 디렉터리를 배포 소스로 설정하면 됩니다.

1. GitHub 저장소의 **Settings → Pages**로 이동합니다.
2. **Build and deployment**에서 **Deploy from a branch**를 선택합니다.
3. 브랜치를 `main`, 폴더를 `/(root)`로 지정하고 저장합니다.
4. 배포가 끝나면 <https://mystic87.github.io>에서 확인합니다.

## 라이선스

개인 포트폴리오 콘텐츠의 권리는 저장소 소유자에게 있습니다.
