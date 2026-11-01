// Entry for the vendored three.js bundle (see tools/build-vendor.mjs). Named exports only, so esbuild can drop what
// the game never touches. Add a name here before using it in src/js/gfx/. Addons ride in the same bundle so they share
// the core classes.
export {
  WebGLRenderer, WebGLRenderTarget, Scene, PerspectiveCamera, OrthographicCamera, Group, Object3D,
  Mesh, InstancedMesh, Points, LineSegments, Line, Sprite,
  BufferGeometry, BufferAttribute, Float32BufferAttribute, Uint16BufferAttribute, InstancedBufferAttribute,
  PlaneGeometry, BoxGeometry, CylinderGeometry, SphereGeometry, ConeGeometry, CircleGeometry, RingGeometry,
  TorusGeometry, CapsuleGeometry, ExtrudeGeometry, LatheGeometry, TubeGeometry, ShapeGeometry, Shape, Path,
  CatmullRomCurve3, CurvePath, LineCurve3, QuadraticBezierCurve3,
  MeshBasicMaterial, MeshLambertMaterial, MeshStandardMaterial, MeshPhysicalMaterial, ShaderMaterial,
  PointsMaterial, LineBasicMaterial, SpriteMaterial, MeshDepthMaterial,
  Texture, DataTexture, CanvasTexture, DepthTexture, PMREMGenerator, CubeCamera, WebGLCubeRenderTarget,
  AmbientLight, HemisphereLight, DirectionalLight, SpotLight, PointLight, RectAreaLight,
  Color, Vector2, Vector3, Vector4, Quaternion, Euler, Matrix3, Matrix4, Box3, Sphere, Plane, Ray, Raycaster, MathUtils,
  ColorManagement, Clock,
  LinearFilter, NearestFilter, LinearMipmapLinearFilter, RepeatWrapping, ClampToEdgeWrapping,
  SRGBColorSpace, NoColorSpace, LinearSRGBColorSpace,
  DoubleSide, FrontSide, BackSide, NoToneMapping, NeutralToneMapping, ACESFilmicToneMapping, AgXToneMapping,
  PCFSoftShadowMap, PCFShadowMap, VSMShadowMap,
  RGBAFormat, UnsignedByteType, FloatType, HalfFloatType,
  AdditiveBlending, NormalBlending, MultiplyBlending, DynamicDrawUsage, REVISION,
} from 'three';
export { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
export { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
export { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
export { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
export { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
export { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js';
export { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
export { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
export { mergeGeometries, mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
