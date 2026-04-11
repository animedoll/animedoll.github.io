import * as THREE from 'three';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

(function () {
  const canvas = document.getElementById('coverHero3d');
  const coverSlide = document.querySelector('.cover-slide');
  const canvasHost = coverSlide && coverSlide.querySelector('.cover-hero-canvas-host');
  const wrap = coverSlide && coverSlide.querySelector('.cover-hero-wrap');
  const slideInner = coverSlide && coverSlide.querySelector('.cover-slide-inner');
  if (!canvas || !wrap || !canvasHost || !slideInner || !coverSlide) return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.96;
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();

  (function setupCoverIBL() {
    const pmrem = new THREE.PMREMGenerator(renderer);
    pmrem.compileEquirectangularShader();
    const room = new RoomEnvironment();
    const envRt = pmrem.fromScene(room, 0.04);
    scene.environment = envRt.texture;
    scene.environmentIntensity = 0.48;
    room.dispose();
    pmrem.dispose();
  })();

  const coverShaderUniforms = {
    uCoverRimTint: { value: new THREE.Color(0x66c8ff) },
    uCoverRimStrength: { value: 0.19 },
    uCoverRimPower: { value: 2.35 }
  };
  const camera = new THREE.PerspectiveCamera(42, 1, 0.01, 500);
  camera.position.set(1.15, 0.95, 1.35);

  const ambient = new THREE.AmbientLight(0xe8f4ff, 0.28);
  scene.add(ambient);
  const hemi = new THREE.HemisphereLight(0xd0ecff, 0x1f303c, 0.8);
  scene.add(hemi);
  const key = new THREE.DirectionalLight(0xffffff, 1.42);
  key.position.set(2.3, 3.85, 2.1);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xc8e2ff, 0.3);
  fill.position.set(-3.2, 2.1, 1.4);
  scene.add(fill);
  const bounce = new THREE.DirectionalLight(0xa8d4f0, 0.15);
  bounce.position.set(0.8, -2.8, 1.2);
  scene.add(bounce);
  const rim = new THREE.DirectionalLight(0x42bde8, 0.55);
  rim.position.set(-2.65, 1.6, -2.0);
  scene.add(rim);

  const coverLightPalettes = {
    cyber: {
      ambient: 0xe8f4ff,
      ambientInt: 0.20,
      hemiSky: 0xd0ecff,
      hemiGround: 0x1f303c,
      fill: 0xc8e2ff,
      bounce: 0xa8d4f0,
      rim: 0x42bde8,
      rimShader: 0x7fd4ff,
      rimShaderStrength: 0.28
    },
    verdant: {
      ambient: 0xededeb,
      ambientInt: 0.38,
      hemiSky: 0xe2ebe9,
      hemiGround: 0xc5cec8,
      fill: 0xb8ddd6,
      bounce: 0x9dccc2,
      rim: 0x0d9488,
      rimShader: 0x5eead4,
      rimShaderStrength: 0.24
    }
  };
  function coverThemeId() {
    return document.documentElement.getAttribute('data-theme') === 'verdant' ? 'verdant' : 'cyber';
  }
  function applyCoverThemeLights(theme) {
    var id = theme === 'verdant' ? 'verdant' : 'cyber';
    var p = coverLightPalettes[id];
    ambient.color.setHex(p.ambient);
    ambient.intensity = p.ambientInt;
    hemi.color.setHex(p.hemiSky);
    hemi.groundColor.setHex(p.hemiGround);
    fill.color.setHex(p.fill);
    bounce.color.setHex(p.bounce);
    rim.color.setHex(p.rim);
    coverShaderUniforms.uCoverRimTint.value.setHex(p.rimShader);
    coverShaderUniforms.uCoverRimStrength.value = p.rimShaderStrength;
  }
  applyCoverThemeLights(coverThemeId());
  document.addEventListener('animeDollThemeChange', function (ev) {
    var t = ev.detail && ev.detail.theme ? ev.detail.theme : coverThemeId();
    applyCoverThemeLights(t);
  });

  const COVER_INITIAL_ZOOM = 1.2;
  const COVER_MAX_ZOOM_IN = 1.7;
  const COVER_MIN_ZOOM_SCALE = 0.8;

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.enablePan = false;
  controls.minDistance = 0.35;
  controls.maxDistance = 8;
  controls.target.set(0, 0, 0);
  controls.autoRotate = true;
  controls.autoRotateSpeed = 1.35;

  const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  function applyReducedMotion() {
    if (mqReduce.matches) {
      controls.autoRotate = false;
      controls.enableDamping = false;
    } else {
      controls.autoRotate = true;
      controls.enableDamping = true;
    }
  }
  applyReducedMotion();
  mqReduce.addEventListener('change', applyReducedMotion);

  controls.addEventListener('start', function () {
    controls.autoRotate = false;
  });
  controls.addEventListener('end', function () {
    if (!mqReduce.matches) controls.autoRotate = true;
  });

  const MODEL_BASE = 'model/';
  const MODEL_URL_LOW = MODEL_BASE + 'model_lowpoly.fbx';
  const MODEL_URL_HIGH = MODEL_BASE + 'model.fbx';

  const loadOverlay = document.getElementById('coverModelLoad');
  const loadRing = document.getElementById('coverModelLoadRing');
  const loadPctEl = document.getElementById('coverModelLoadPct');
  const loadLabelEl = document.getElementById('coverModelLoadLabel');
  var loadSlowLoadTimerId = null;
  var loadSlowHintShown = false;
  var RING_LEN = 0;
  if (loadRing) {
    RING_LEN = 2 * Math.PI * 28;
    loadRing.style.strokeDasharray = String(RING_LEN);
    loadRing.style.strokeDashoffset = String(RING_LEN);
  }

  function setRingProgress(pct) {
    if (!loadRing || RING_LEN <= 0) return;
    var p = Math.max(0, Math.min(100, pct));
    loadRing.style.strokeDasharray = String(RING_LEN);
    loadRing.style.strokeDashoffset = String(RING_LEN * (1 - p / 100));
  }

  function clearSlowLoadHintTimer() {
    if (loadSlowLoadTimerId !== null) {
      clearTimeout(loadSlowLoadTimerId);
      loadSlowLoadTimerId = null;
    }
  }

  function scheduleSlowLoadHint() {
    clearSlowLoadHintTimer();
    loadSlowHintShown = false;
    loadSlowLoadTimerId = setTimeout(function () {
      loadSlowLoadTimerId = null;
      if (!loadOverlay || !loadLabelEl) return;
      if (loadOverlay.classList.contains('cover-model-load--hidden') || loadOverlay.classList.contains('cover-model-load--error')) return;
      loadSlowHintShown = true;
      loadLabelEl.textContent = '当前模型加载过慢，请检查您的网络环境';
    }, 10000);
  }

  function hideLoadOverlay() {
    clearSlowLoadHintTimer();
    loadSlowHintShown = false;
    if (!loadOverlay) return;
    loadOverlay.setAttribute('aria-busy', 'false');
    loadOverlay.classList.add('cover-model-load--hidden');
    loadOverlay.classList.remove('cover-model-load--indeterminate');
  }

  function setLoadError(message) {
    clearSlowLoadHintTimer();
    loadSlowHintShown = false;
    if (!loadOverlay || !loadLabelEl) return;
    loadOverlay.classList.remove('cover-model-load--indeterminate', 'cover-model-load--hidden');
    loadOverlay.setAttribute('aria-busy', 'false');
    loadOverlay.classList.add('cover-model-load--error');
    loadLabelEl.textContent = message;
    if (loadPctEl) loadPctEl.textContent = '';
    setRingProgress(0);
  }

  /* ev: XHR progress event; base/span map file progress into overall 0–100% */
  function applyLoadProgress(ev, base, span) {
    if (!loadOverlay || !loadRing || !loadPctEl) return;
    if (loadOverlay.classList.contains('cover-model-load--error')) return;
    if (ev.lengthComputable && ev.total > 0) {
      var t = base + (ev.loaded / ev.total) * span;
      var pct = Math.min(100, Math.round(t * 100));
      setRingProgress(pct);
      loadPctEl.textContent = pct + '%';
      loadOverlay.classList.remove('cover-model-load--indeterminate');
    } else {
      loadOverlay.classList.add('cover-model-load--indeterminate');
      loadPctEl.textContent = '…';
    }
  }

  function disposeLoadedModel(root) {
    if (!root) return;
    root.traverse(function (child) {
      if (!child.isMesh) return;
      if (child.geometry) child.geometry.dispose();
      var mats = child.material;
      if (!mats) return;
      if (!Array.isArray(mats)) mats = [mats];
      mats.forEach(function (mat) {
        if (!mat) return;
        ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'emissiveMap', 'aoMap', 'lightMap'].forEach(function (key) {
          var t = mat[key];
          if (t && t.dispose) t.dispose();
        });
        mat.dispose();
      });
    });
  }

  var COVER_MAT_MAP_KEYS = [
    'map',
    'lightMap',
    'bumpMap',
    'normalMap',
    'specularMap',
    'alphaMap',
    'displacementMap',
    'emissiveMap',
    'envMap',
    'aoMap',
    'roughnessMap',
    'metalnessMap',
    'clearcoatNormalMap'
  ];

  function stripMaterialTextureRefs(m) {
    COVER_MAT_MAP_KEYS.forEach(function (key) {
      m[key] = null;
    });
  }

  function installCoverPresentationRim(mat) {
    if (!mat.isMeshPhysicalMaterial || mat.userData.coverRimInstalled) return;
    mat.userData.coverRimInstalled = true;
    mat.onBeforeCompile = function (shader) {
      shader.uniforms.uCoverRimTint = coverShaderUniforms.uCoverRimTint;
      shader.uniforms.uCoverRimStrength = coverShaderUniforms.uCoverRimStrength;
      shader.uniforms.uCoverRimPower = coverShaderUniforms.uCoverRimPower;
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <common>',
        `#include <common>
uniform vec3 uCoverRimTint;
uniform float uCoverRimStrength;
uniform float uCoverRimPower;`
      );
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <output_fragment>',
        `{
  vec3 viewDir = normalize( vViewPosition );
  float ndv = saturate( dot( normalize( normal ), viewDir ) );
  float rim = pow( 1.0 - ndv, uCoverRimPower );
  outgoingLight += uCoverRimTint * ( rim * uCoverRimStrength );
}
#include <output_fragment>`
      );
    };
    mat.needsUpdate = true;
  }

  function tuneCoverPhysicalInPlace(mat) {
    if (!mat.isMeshPhysicalMaterial || mat.userData.coverPresentationTuned) return;
    mat.userData.coverPresentationTuned = true;
    if (mat.clearcoat < 0.008) {
      mat.clearcoat = 0.078;
      mat.clearcoatRoughness = 0.68;
    }
    if (!mat.sheen || mat.sheen < 0.003) {
      mat.sheen = 0.09;
      mat.sheenRoughness = 0.76;
      mat.sheenColor.setRGB(1, 1, 1);
    }
    var baseEnvI = mat.envMapIntensity != null ? mat.envMapIntensity : 1;
    mat.envMapIntensity = THREE.MathUtils.clamp(baseEnvI * 0.9, 0.35, 1.75);
    mat.roughness = THREE.MathUtils.clamp((mat.roughness != null ? mat.roughness : 0.55) * 0.96, 0.2, 1);
    installCoverPresentationRim(mat);
  }

  function buildCoverMaterialUpgrade(src) {
    if (!src || src.isMeshBasicMaterial) return src;
    if (src.isMeshPhysicalMaterial) {
      tuneCoverPhysicalInPlace(src);
      return src;
    }
    if (src.isMeshStandardMaterial) {
      var mat = new THREE.MeshPhysicalMaterial();
      mat.copy(src);
      tuneCoverPhysicalInPlace(mat);
      return mat;
    }
    if (src.isMeshPhongMaterial || src.isMeshLambertMaterial) {
      var m = new THREE.MeshPhysicalMaterial();
      m.map = src.map;
      m.lightMap = src.lightMap;
      m.color.copy(src.color);
      m.emissive.copy(src.emissive);
      m.emissiveMap = src.emissiveMap;
      m.normalMap = src.normalMap;
      if (src.normalScale) m.normalScale.copy(src.normalScale);
      m.alphaMap = src.alphaMap;
      m.transparent = src.transparent;
      m.opacity = src.opacity;
      m.side = src.side;
      m.alphaTest = src.alphaTest;
      m.vertexColors = src.vertexColors;
      m.depthWrite = src.depthWrite;
      m.depthTest = src.depthTest;
      m.roughness = src.isMeshPhongMaterial ? 0.48 : 0.78;
      m.metalness = 0.035;
      m.envMapIntensity = 0.9;
      tuneCoverPhysicalInPlace(m);
      return m;
    }
    return src;
  }

  function applyCoverMaterials(root) {
    var usage = new Map();
    root.traverse(function (child) {
      if (!child.isMesh || !child.material) return;
      var list = Array.isArray(child.material) ? child.material : [child.material];
      for (var i = 0; i < list.length; i++) {
        var mat = list[i];
        if (mat) usage.set(mat, true);
      }
    });

    var upgradeMap = new Map();
    usage.forEach(function (_, src) {
      upgradeMap.set(src, buildCoverMaterialUpgrade(src));
    });

    root.traverse(function (child) {
      if (!child.isMesh || !child.material) return;
      var mats = child.material;
      var isArr = Array.isArray(mats);
      var list = isArr ? mats : [mats];
      var next = [];
      for (var mi = 0; mi < list.length; mi++) {
        next.push(upgradeMap.get(list[mi]) || list[mi]);
      }
      child.material = isArr ? next : next[0];
      var applyList = isArr ? next : [next[0]];
      for (var ai = 0; ai < applyList.length; ai++) {
        var m = applyList[ai];
        if (!m) continue;
        if (m.map) m.map.colorSpace = THREE.SRGBColorSpace;
        if (m.emissiveMap) m.emissiveMap.colorSpace = THREE.SRGBColorSpace;
      }
    });

    usage.forEach(function (_, src) {
      var rep = upgradeMap.get(src);
      if (rep && rep !== src && !src.isMeshBasicMaterial) {
        stripMaterialTextureRefs(src);
        src.dispose();
      }
    });
  }

  let modelRoot = null;
  let baseCamOffset = null;
  const fbxLoader = new FBXLoader();
  fbxLoader.setResourcePath(MODEL_BASE);

  function syncCoverHeroCanvasHostLayout() {
    var ih = slideInner.clientHeight;
    if (ih < 2) return;
    var innerRect = slideInner.getBoundingClientRect();
    var wrapRect = wrap.getBoundingClientRect();
    var cy = (wrapRect.top + wrapRect.bottom) / 2 - innerRect.top;
    var H = 2 * (ih - cy);
    var minH = Math.max(wrap.clientHeight * 2.35, 520);
    H = Math.max(H, minH);
    canvasHost.style.top = ih - H + 'px';
    canvasHost.style.height = H + 'px';
  }

  function applyLoadedModel(object) {
    if (modelRoot) {
      scene.remove(modelRoot);
      disposeLoadedModel(modelRoot);
    }
    modelRoot = object;
    applyCoverMaterials(modelRoot);
    scene.add(modelRoot);

    var box = new THREE.Box3().setFromObject(modelRoot);
    var center = box.getCenter(new THREE.Vector3());
    var size = box.getSize(new THREE.Vector3());
    modelRoot.position.sub(center);

    var maxDim = Math.max(size.x, size.y, size.z, 0.001);
    var fit = 0.94 / maxDim;
    modelRoot.scale.setScalar(fit);

    var box2 = new THREE.Box3().setFromObject(modelRoot);
    var sphere = box2.getBoundingSphere(new THREE.Sphere());
    var vFov = camera.fov * (Math.PI / 180);
    var dist = Math.max(0.25, (sphere.radius / Math.sin(vFov / 2)) * 1.06);
    camera.position.set(dist * 0.48, dist * 0.20, dist * 0.58);
    controls.target.copy(sphere.center);
    baseCamOffset = camera.position.clone().sub(controls.target);

    syncCoverHeroCanvasHostLayout();

    var lw = wrap.clientWidth;
    var cw = canvasHost.clientWidth;
    var ch = canvasHost.clientHeight;
    var framing = 1;
    if (lw >= 2 && cw >= 2 && ch >= 2) {
      framing = Math.max(cw / lw, ch / lw);
      if (framing < 1.001) framing = 1;
    }
    if (framing > 1) {
      camera.position.copy(controls.target).add(baseCamOffset.clone().multiplyScalar(framing));
    }

    var toCam = camera.position.clone().sub(controls.target);
    toCam.multiplyScalar(1 / COVER_INITIAL_ZOOM);
    camera.position.copy(controls.target).add(toCam);

    var dInit = camera.position.distanceTo(controls.target);
    controls.minDistance = Math.max(0.06, dInit / COVER_MAX_ZOOM_IN);
    controls.maxDistance = dInit / COVER_MIN_ZOOM_SCALE;

    camera.near = Math.max(0.001, dInit * 0.001);
    camera.far = Math.max(200, dInit * 40);
    camera.updateProjectionMatrix();
    controls.update();
  }

  function onLoadFatal() {
    scene.background = null;
  }

  if (loadLabelEl) loadLabelEl.textContent = '正在加载预览模型…';
  scheduleSlowLoadHint();

  fbxLoader.load(
    MODEL_URL_LOW,
    function (object) {
      applyLoadedModel(object);
      setRingProgress(40);
      if (loadPctEl) loadPctEl.textContent = '40%';
      if (loadLabelEl && !loadSlowHintShown) loadLabelEl.textContent = '正在加载精细模型…';
      if (loadOverlay) loadOverlay.classList.remove('cover-model-load--indeterminate');

      fbxLoader.load(
        MODEL_URL_HIGH,
        function (high) {
          applyLoadedModel(high);
          hideLoadOverlay();
        },
        function (ev) {
          applyLoadProgress(ev, 0.4, 0.6);
        },
        function () {
          hideLoadOverlay();
        }
      );
    },
    function (ev) {
      applyLoadProgress(ev, 0, 0.4);
    },
    function () {
      if (loadLabelEl && !loadSlowHintShown) loadLabelEl.textContent = '正在加载精细模型…';
      if (loadOverlay) loadOverlay.classList.remove('cover-model-load--indeterminate');
      setRingProgress(0);
      if (loadPctEl) loadPctEl.textContent = '';

      fbxLoader.load(
        MODEL_URL_HIGH,
        function (high) {
          applyLoadedModel(high);
          hideLoadOverlay();
        },
        function (ev) {
          applyLoadProgress(ev, 0, 1);
        },
        function () {
          setLoadError('3D 模型加载失败，请检查网络后刷新页面。');
          onLoadFatal();
        }
      );
    }
  );

  function resize() {
    syncCoverHeroCanvasHostLayout();
    var w = canvasHost.clientWidth;
    var h = canvasHost.clientHeight;
    if (w < 2 || h < 2) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(slideInner);
  ro.observe(canvasHost);
  ro.observe(wrap);

  let running = false;
  function tick() {
    if (!running) return;
    requestAnimationFrame(tick);
    controls.update();
    renderer.render(scene, camera);
  }

  function setRunning(on) {
    const should = on && coverSlide.classList.contains('active');
    if (should === running) return;
    running = should;
    if (running) tick();
  }

  const mo = new MutationObserver(function () {
    setRunning(true);
    syncCoverHeroCanvasHostLayout();
    resize();
  });
  mo.observe(coverSlide, { attributes: true, attributeFilter: ['class'] });
  setRunning(true);
})();
