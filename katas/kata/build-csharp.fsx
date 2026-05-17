// include Fake lib
#r "packages/FAKE/tools/FakeLib.dll"
#load "build.fsx"

open Build
open Fake

// Properties
let settings = { 
    buildDir = "./artifacts/"; 
    solution = "Src/csharp-kata.sln"; 
    projetsPattern = "Src/**/*.csproj"; 
    watchFilePattern = "Src/**/*.cs"; 
    coverageAssembliesPattern = "*-csharp.dll";
}

SetUpBuild settings
// start build
RunTargetOrDefault "Default"