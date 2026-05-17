// include Fake lib
#r "packages/FAKE/tools/FakeLib.dll"
#load "build.fsx"

open Build
open Fake

// Properties
let settings = { 
    buildDir = "./artifacts/"; 
    solution = "Src/fsharp-kata.sln"; 
    projetsPattern = "Src/**/*.fsproj"; 
    watchFilePattern = "Src/**/*.fs"; 
    coverageAssembliesPattern = "*-fsharp.dll";
}

SetUpBuild settings
// start build
RunTargetOrDefault "Default"