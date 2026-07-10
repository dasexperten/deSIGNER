Option Explicit
' ============================================================================
'  ExportDETOXtoSVG  — WINDOWS CorelDRAW VBA (Alt+F11). Mac Corel has no VBA.
'  Exports ACTIVE document to SVG with EDITABLE TEXT + EMBEDDED (used) FONTS
'  + NO RASTERIZATION. SVG options are set in the dialog ONCE (Corel remembers
'  them); the cdr filter is resolved so the exact enum name is never needed.
' ============================================================================
Public Sub ExportDETOXtoSVG()
    Const OUT_PATH As String = "C:\detox\DETOX_master.svg"
    Const SET_DIALOG As Boolean = True   ' True: show dialog once to tick options.
                                         ' False: silent reuse of saved settings.
    On Error GoTo Fail
    Dim doc As Document: Set doc = ActiveDocument
    If doc Is Nothing Then MsgBox "Open the DETOX file first.", vbExclamation: Exit Sub

    Dim folderPath As String: folderPath = Left$(OUT_PATH, InStrRev(OUT_PATH, "\") - 1)
    If Dir(folderPath, vbDirectory) = "" Then MkDir folderPath

    Dim expOpt As StructExportOptions: Set expOpt = CreateStructExportOptions
    expOpt.UseColorProfile = True

    Dim expFlt As ExportFilter
    Set expFlt = doc.ExportEx(OUT_PATH, cdrSVG, cdrCurrentPage, expOpt)
    ' FALLBACK if 'cdrSVG' undefined in your build — replace the line above with:
    '   Dim flt As Long: flt = Application.FileExportFilter(".svg")
    '   Set expFlt = doc.ExportEx(OUT_PATH, flt, cdrCurrentPage, expOpt)
    If expFlt Is Nothing Then MsgBox "No SVG filter.", vbCritical: Exit Sub

    If SET_DIALOG Then
        ' In the dialog TICK:  1) Export text as text (NOT curves)
        '                      2) Embed fonts -> Fonts used
        '                      3) Bitmaps -> Embedded
        If expFlt.ShowDialog = False Then MsgBox "Cancelled.", vbInformation: Exit Sub
    End If
    expFlt.Finish
    MsgBox "SVG OK -> " & OUT_PATH & vbCrLf & "Verify: open in Notepad, search <text", vbInformation
    Exit Sub
Fail:
    MsgBox "FAILED. Err " & Err.Number & ": " & Err.Description, vbCritical
End Sub
